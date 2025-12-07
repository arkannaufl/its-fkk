<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Unit\StoreUnitRequest;
use App\Http\Requests\Unit\UpdateUnitRequest;
use App\Http\Requests\User\AssignUserToUnitRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class OrganizationalChartController extends Controller
{
    /**
     * Get organizational chart structure
     */
    public function index(): JsonResponse
    {
        $units = Unit::with(['parentUnit', 'childUnits', 'users'])
            ->active()
            ->orderBy('type')
            ->orderBy('name')
            ->get();

        $unassignedUsers = User::unassigned()
            ->active()
            ->get(['id', 'name', 'email', 'username', 'employee_id', 'role']);

        return response()->json([
            'success' => true,
            'data' => [
                'units' => $units,
                'unassigned_users' => $unassignedUsers,
            ],
        ]);
    }

    /**
     * Create a new unit
     */
    public function storeUnit(StoreUnitRequest $request): JsonResponse
    {
        $unit = Unit::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Unit berhasil dibuat.',
            'data' => $unit->load(['parentUnit', 'childUnits']),
        ], 201);
    }

    /**
     * Update a unit
     */
    public function updateUnit(UpdateUnitRequest $request, Unit $unit): JsonResponse
    {
        $unit->update($request->validated());

        // Update role of users in this unit if role changed
        if ($request->has('role') && $request->role !== $unit->getOriginal('role')) {
            $unit->users()->update(['role' => $request->role]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Unit berhasil diperbarui.',
            'data' => $unit->load(['parentUnit', 'childUnits', 'users']),
        ]);
    }

    /**
     * Delete a unit
     */
    public function destroyUnit(Unit $unit): JsonResponse
    {
        // Check if unit has children
        if ($unit->childUnits()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Unit tidak bisa dihapus karena masih memiliki unit anak.',
            ], 422);
        }

        // Unassign all users from this unit before deleting
        $unit->users()->update([
            'unit_id' => null,
            'assigned_at' => null,
            'role' => User::ROLE_SDM, // Reset to default role
        ]);

        $unit->delete();

        return response()->json([
            'success' => true,
            'message' => 'Unit berhasil dihapus. User yang ada di unit ini telah dikembalikan ke unassigned.',
        ]);
    }

    /**
     * Create a new user (without role/unit assignment)
     */
    public function storeUser(StoreUserRequest $request): JsonResponse
    {
        $user = User::create([
            ...$request->validated(),
            'password' => bcrypt($request->password),
            'role' => User::ROLE_SDM, // Default role
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dibuat.',
            'data' => $user->makeHidden(['password']),
        ], 201);
    }

    /**
     * Assign user to unit
     */
    public function assignUserToUnit(AssignUserToUnitRequest $request, User $user): JsonResponse
    {
        // Admin tidak bisa di-assign ke unit manapun
        if ($user->hasRole(User::ROLE_ADMIN)) {
            return response()->json([
                'success' => false,
                'message' => 'User dengan role admin tidak bisa di-assign ke unit.',
            ], 422);
        }

        $unit = $request->unit_id ? Unit::find($request->unit_id) : null;

        $user->assignToUnit($unit);

        // Update unit position if provided
        if ($unit && ($request->has('position_x') || $request->has('position_y'))) {
            $unit->update([
                'position_x' => $request->position_x ?? $unit->position_x,
                'position_y' => $request->position_y ?? $unit->position_y,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => $unit ? 'User berhasil di-assign ke unit.' : 'User berhasil di-unassign dari unit.',
            'data' => $user->load('unit'),
        ]);
    }

    /**
     * Update a user
     */
    public function updateUser(UpdateUserRequest $request, User $user): JsonResponse
    {
        // Prevent updating admin users
        if ($user->hasRole(User::ROLE_ADMIN)) {
            return response()->json([
                'success' => false,
                'message' => 'User dengan role admin tidak bisa diupdate.',
            ], 422);
        }

        $data = $request->validated();
        
        // Only update password if provided
        if (empty($data['password'])) {
            unset($data['password']);
            unset($data['password_confirmation']);
        } else {
            $data['password'] = bcrypt($data['password']);
            unset($data['password_confirmation']);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User berhasil diperbarui.',
            'data' => $user->makeHidden(['password']),
        ]);
    }

    /**
     * Delete a user
     */
    public function destroyUser(User $user): JsonResponse
    {
        // Prevent deleting admin users
        if ($user->hasRole(User::ROLE_ADMIN)) {
            return response()->json([
                'success' => false,
                'message' => 'User dengan role admin tidak bisa dihapus.',
            ], 422);
        }

        // Unassign from unit before deleting
        $user->update([
            'unit_id' => null,
            'assigned_at' => null,
        ]);

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User berhasil dihapus.',
        ]);
    }

}

