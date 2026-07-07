<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
            ],
            'phone' => [
                'required',
                'string',
                'max:30',
            ],
            'avatar_url' => [
                'nullable',
                'image',
                'max:5120', // 5MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Admin name is required.',
            'email.required' => 'Email is required.',
            'phone.required' => 'Phone number is required.',
            'avatar_url.image' => 'Avatar must be a valid image file.',
            'avatar_url.max' => 'Avatar size must not exceed 5MB.',
        ];
    }
}
