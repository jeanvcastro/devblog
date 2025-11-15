<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(["author", "tags"])->published();

        if ($request->has("tag")) {
            $query->whereHas("tags", function ($q) use ($request) {
                $q->where("slug", $request->tag);
            });
        }

        if ($request->has("search")) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where("title", "like", "%{$search}%")->orWhere(
                    "content",
                    "like",
                    "%{$search}%",
                );
            });
        }

        $orderBy = $request->get("order_by", "published_at");
        $orderDir = $request->get("order_dir", "desc");

        $query->orderBy($orderBy, $orderDir);

        return $query->paginate(10);
    }

    public function show(Post $post)
    {
        return $post->load(["author", "tags", "comments.user"]);
    }

    public function mostViewed()
    {
        return Post::with(["author", "tags"])
            ->published()
            ->mostViewed(5)
            ->get();
    }

    public function recent()
    {
        return Post::with(["author", "tags"])
            ->published()
            ->recent(10)
            ->get();
    }

    public function search(Request $request)
    {
        $search = $request->get("q");
        $tags = $request->get("tags");

        $query = Post::with(["author", "tags"])->published();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where("title", "like", "%{$search}%")->orWhere(
                    "content",
                    "like",
                    "%{$search}%",
                );
            });
        }

        if ($tags) {
            $tagSlugs = explode(",", $tags);
            foreach ($tagSlugs as $slug) {
                $query->whereHas("tags", function ($q) use ($slug) {
                    $q->where("slug", trim($slug));
                });
            }
        }

        return $query->orderBy("published_at", "desc")->paginate(3);
    }

    public function store(StorePostRequest $request)
    {
        $userId = Auth::id();
        $validated = $request->validated();
        $validated["author_id"] = $userId;

        $tagUuids = $validated["tags"] ?? [];
        unset($validated["tags"]);

        $post = Post::create($validated);

        if (!empty($tagUuids)) {
            $tagIds = Tag::whereIn("uuid", $tagUuids)->pluck("id")->toArray();
            $post->tags()->attach($tagIds);
        }

        return $post->load(["author", "tags"]);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $validated = $request->validated();

        $tagUuids = $validated["tags"] ?? null;
        unset($validated["tags"]);

        $post->update($validated);

        if ($tagUuids !== null) {
            $tagIds = Tag::whereIn("uuid", $tagUuids)->pluck("id")->toArray();
            $post->tags()->sync($tagIds);
        }

        return $post->load(["author", "tags"]);
    }

    public function destroy(Post $post)
    {
        $this->authorize("delete", $post);

        $post->delete();
        return response()->json(["message" => "Post deleted successfully"]);
    }
}
