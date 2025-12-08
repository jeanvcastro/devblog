<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "name" => "sometimes|string|max:255",
            "job_title" => "sometimes|nullable|string|max:100",
            "bio" => "sometimes|nullable|string|max:500",
        ];
    }
}
