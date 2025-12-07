<?php

namespace App\Http\Requests\Unit;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUnitRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->hasRole(\App\Models\User::ROLE_ADMIN) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $unitId = $this->route('unit');

        return [
            'code' => ['required', 'string', 'max:100', Rule::unique('units', 'code')->ignore($unitId)],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:wadek_i,wadek_ii,unit,sdm'],
            'parent_unit_id' => ['nullable', 'integer', 'exists:units,id', Rule::notIn([$unitId])],
            'role' => ['required', 'string', 'in:admin,dekan,wadek,unit,sdm'],
            'description' => ['nullable', 'string', 'max:1000'],
            'position_x' => ['nullable', 'integer'],
            'position_y' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'code.required' => 'Kode unit wajib diisi.',
            'code.unique' => 'Kode unit sudah digunakan.',
            'name.required' => 'Nama unit wajib diisi.',
            'type.required' => 'Tipe unit wajib diisi.',
            'type.in' => 'Tipe unit tidak valid.',
            'parent_unit_id.exists' => 'Unit induk tidak ditemukan.',
            'parent_unit_id.not_in' => 'Unit tidak bisa menjadi parent dari dirinya sendiri.',
            'role.required' => 'Role wajib diisi.',
            'role.in' => 'Role tidak valid.',
        ];
    }
}

