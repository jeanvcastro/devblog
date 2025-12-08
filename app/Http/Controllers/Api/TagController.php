<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        return Tag::withCount("posts")->get();
    }

    public function adminIndex(Request $request)
    {
        $query = Tag::withCount("posts");

        if ($search = $request->get("q")) {
            $query->where(function ($q) use ($search) {
                $q->where("name", "like", "%{$search}%")->orWhere(
                    "slug",
                    "like",
                    "%{$search}%",
                );
            });
        }

        return $query->orderBy("name")->paginate(10);
    }

    public function show(Tag $tag)
    {
        return $tag->load([
            "posts" => function ($query) {
                $query
                    ->published()
                    ->with("author")
                    ->orderBy("published_at", "desc");
            },
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "slug" => "required|string|unique:tags,slug",
        ]);

        return Tag::create($validated);
    }

    public function update(Request $request, Tag $tag)
    {
        $validated = $request->validate([
            "name" => "sometimes|string|max:255",
            "slug" => "sometimes|string|unique:tags,slug," . $tag->id,
        ]);

        $tag->update($validated);
        return $tag;
    }

    public function destroy(Tag $tag)
    {
        if ($tag->posts()->exists()) {
            return response()->json(
                ["message" => "Não é possível excluir uma tag que está em uso"],
                422,
            );
        }

        $tag->delete();
        return response()->json(["message" => "Tag deleted successfully"]);
    }
}
