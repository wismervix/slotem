<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class ServiceFormRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'description' => [
                'required',
                'string',
                'max:1000',
            ],
            'icon' => [
                'required',
                'string',
                Rule::in(['scissors', 'user-check', 'sparkles', 'paintbrush', 'shield-check']),
            ],
            'price' => [
                'required',
                'string',
                'regex:/^\d+(\.\d{1,2})?$/',
            ],
            'variant' => [
                'required',
                'string',
                Rule::in(['standard', 'featured']),
            ],
            'duration' => [
                'required',
                'integer',
                'min:5',
                'max:480',
            ],
            'active' => [
                'required',
                'boolean',
            ],
            'badges' => [
                'nullable',
                'array',
            ],
            'badges.*' => [
                'string',
                Rule::in(['popular', 'recommended', 'best-value']),
            ],
            'image' => [
                'nullable',
                'image',
                'max:5120', // 5MB
            ],
            // 'image_public_id' => [
            //     'nullable',
            //     'string',
            //     'max:255',
            // ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Service name is required.',
            'description.required' => 'Description is required.',
            'price.regex' => 'Price must be a valid decimal number.',
            'duration.min' => 'Duration must be at least 5 minutes.',
            'duration.max' => 'Duration cannot exceed 480 minutes.',
            'image.max' => 'Image size must not exceed 5MB.',
        ];
    }
}
