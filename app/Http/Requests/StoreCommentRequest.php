<?php

namespace App\Http\Requests;

use App\Models\Comment;
use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can("create", Comment::class);
    }

    public function rules(): array
    {
        return [
            "post_uuid" => "required|uuid|exists:posts,uuid",
            "parent_uuid" => "nullable|uuid|exists:comments,uuid",
            "content" => "required|string|max:2000",
        ];
    }
}
