<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // or add auth logic if needed
    }

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
                Rule::unique('users')
                    ->ignore($this->user()->id),
            ],
            'phone' => [
                'nullable',
                'string',
                'max:30',
            ],
            'password' => [
                'nullable',
                'string',
                'min:8',
            ],
            'avatar_url' => [
                'nullable',
                'image',
                'max:5120',
            ],
            'marketing_consent' => [
                'boolean',
            ],
            'product_updates' => [
                'boolean',
            ],
            'sms_reminders' => [
                'boolean',
            ],
            'sound_enabled' => [
                'boolean',
            ],
        ];
    }
}
