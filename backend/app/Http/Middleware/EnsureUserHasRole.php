<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.',
            ], 401);
        }

        if (empty($roles)) {
            return $next($request);
        }

        $validRoles = array_intersect($roles, User::ROLES);
        if (empty($validRoles)) {
            \Log::warning('Invalid roles specified in middleware', [
                'roles' => $roles,
                'user_id' => $user->id,
                'route' => $request->route()?->getName(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid role configuration.',
            ], 500);
        }

        foreach ($validRoles as $role) {
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        \Log::info('Access denied: User does not have required role', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'required_roles' => $validRoles,
            'route' => $request->route()?->getName(),
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Forbidden. You do not have permission to access this resource.',
            'required_roles' => $validRoles,
            'your_role' => $user->role,
        ], 403);
    }
}
