<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function index(Post $post)
    {
        return $post
            ->comments()
            ->with(["user", "replies.user"])
            ->whereNull("parent_id")
            ->approved()
            ->orderBy("created_at", "desc")
            ->get();
    }

    public function store(StoreCommentRequest $request)
    {
        $userId = Auth::id();
        $validated = $request->validated();

        $postId = Post::where("uuid", $validated["post_uuid"])->value("id");
        $parentId = isset($validated["parent_uuid"])
            ? Comment::where("uuid", $validated["parent_uuid"])->value("id")
            : null;

        $comment = Comment::create([
            "post_id" => $postId,
            "parent_id" => $parentId,
            "user_id" => $userId,
            "content" => $validated["content"],
            "approved" => false,
        ]);

        return $comment->load("user");
    }

    public function approve(Comment $comment)
    {
        $this->authorize("approve", Comment::class);

        $comment->update(["approved" => true]);
        return $comment;
    }

    public function destroy(Comment $comment)
    {
        $this->authorize("delete", $comment);

        $comment->delete();
        return response()->json(["message" => "Comment deleted successfully"]);
    }
}
