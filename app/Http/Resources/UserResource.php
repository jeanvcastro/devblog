<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "uuid" => $this->uuid,
            "name" => $this->name,
            "email" => $this->email,
            "avatar" => $this->avatar,
            "job_title" => $this->job_title,
            "bio" => $this->bio,
            "role" => $this->roles->first()?->name,
            "created_at" => $this->created_at,
        ];
    }
}
