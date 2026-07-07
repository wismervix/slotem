<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WebsiteSettingsRequest extends FormRequest
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
            'manager_name' => [
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
            'address' => [
                'required',
                'string',
                'max:500',
            ],
            'description' => [
                'required',
                'string',
                'max:2000',
            ],
            'website_url' => [
                'required',
                'url',
                'max:255',
            ],
            'logo_url' => [
                'nullable',
                'image',
                'max:5120', // 5MB
            ],
            'favicon_url' => [
                'nullable',
                'image',
                'max:5120', // 5MB
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Business name is required.',
            'manager_name.required' => 'Manager name is required.',
            'email.required' => 'Email is required.',
            'phone.required' => 'Phone number is required.',
            'address.required' => 'Address is required.',
            'description.required' => 'Description is required.',
            'website_url.required' => 'Website URL is required.',
            'website_url.url' => 'Website URL must be a valid URL.',
            'logo_url.image' => 'Logo must be a valid image file.',
            'logo_url.max' => 'Logo size must not exceed 5MB.',
            'favicon_url.image' => 'Favicon must be a valid image file.',
            'favicon_url.max' => 'Favicon size must not exceed 5MB.',
        ];
    }
}
