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
        return $user->canManagePosts();
    }

    public function update(User $user, Post $post): bool
    {
        if ($user->hasAnyRole(["admin", "superadmin"])) {
            return true;
        }

        return $user->isEditor() && $post->author_id === $user->id;
    }

    public function delete(User $user, Post $post): bool
    {
        if ($user->hasAnyRole(["admin", "superadmin"])) {
            return true;
        }

        return $user->isEditor() && $post->author_id === $user->id;
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->hasAnyRole(["admin", "superadmin"]);
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return $user->hasAnyRole(["admin", "superadmin"]);
    }

    public function publish(User $user): bool
    {
        return $user->hasAnyRole(["admin", "superadmin"]);
    }
}
