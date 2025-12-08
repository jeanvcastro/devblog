<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can("update", $this->route("user"));
    }

    public function rules(): array
    {
        $user = $this->route("user");

        return [
            "name" => "sometimes|string|max:255",
            "email" => [
                "sometimes",
                "email",
                "max:255",
                Rule::unique("users", "email")->ignore($user->id),
            ],
            "role" => "sometimes|in:reader,editor,admin",
        ];
    }
}
