<?php

namespace App\Http\Requests;

use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->route("post");
        return $this->user()->can("update", $post);
    }

    public function rules(): array
    {
        $post = $this->route("post");

        return [
            "title" => "sometimes|string|max:255",
            "slug" => [
                "sometimes",
                "string",
                "max:255",
                Rule::unique("posts", "slug")->ignore($post->id),
            ],
            "content" => "sometimes|string",
            "excerpt" => "nullable|string|max:500",
            "status" => "sometimes|in:draft,published",
            "published_at" => "nullable|date",
            "reading_time" => "nullable|integer|min:0",
            "tags" => "nullable|array",
            "tags.*" => "uuid|exists:tags,uuid",
        ];
    }

    protected function passedValidation(): void
    {
        $user = $this->user();
        $post = $this->route("post");

        if (
            $this->status === "published" &&
            $post->status !== "published" &&
            !$user->can("publish", Post::class)
        ) {
            $this->merge(["status" => "draft"]);
        }
    }
}
