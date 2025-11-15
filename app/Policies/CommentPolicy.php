<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CommentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(?User $user): bool
    {
        return $user && $user->is_admin;
    }

    public function view(?User $user, Comment $comment): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Comment $comment): bool
    {
        return $user->is_admin || $user->id === $comment->user_id;
    }

    public function delete(User $user, Comment $comment): bool
    {
        return $user->is_admin || $user->id === $comment->user_id;
    }

    public function restore(User $user, Comment $comment): bool
    {
        return $user->is_admin;
    }

    public function forceDelete(User $user, Comment $comment): bool
    {
        return $user->is_admin;
    }

    public function approve(User $user): bool
    {
        return $user->is_admin;
    }
}
