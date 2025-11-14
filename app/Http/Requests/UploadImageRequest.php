<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'image' => 'required|image|mimes:jpeg,jpg,png,gif,webp|max:5120',
        ];
    }

    public function messages(): array
    {
        return [
            'image.required' => 'An image file is required.',
            'image.image' => 'The file must be an image.',
            'image.mimes' => 'Only jpeg, jpg, png, gif, and webp images are allowed.',
            'image.max' => 'The image must not exceed 5MB.',
        ];
    }
}
