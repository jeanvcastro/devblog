<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PostPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Post $post): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->is_admin;
    }

    public function update(User $user, Post $post): bool
    {
        return $user->is_admin;
    }

    public function delete(User $user, Post $post): bool
    {
        return $user->is_admin;
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->is_admin;
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return $user->is_admin;
    }
}
