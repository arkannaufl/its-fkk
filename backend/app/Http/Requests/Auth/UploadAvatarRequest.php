<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UploadAvatarRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'avatar' => [
                'required',
                'image',
                'mimes:jpeg,jpg,png,gif',
                'max:2048',
                'dimensions:max_width=2000,max_height=2000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'avatar.required' => 'File avatar wajib diisi.',
            'avatar.image' => 'File harus berupa gambar.',
            'avatar.max' => 'Ukuran file maksimal 2MB.',
            'avatar.mimes' => 'Format file harus jpeg, jpg, png, atau gif.',
            'avatar.dimensions' => 'Dimensi gambar maksimal 2000x2000 piksel.',
        ];
    }
}
