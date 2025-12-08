<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user || !$user->hasAnyRole(["admin", "superadmin"])) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $files = Storage::disk("public")->files("images/posts");

        $images = collect($files)
            ->map(function ($file) {
                return [
                    "filename" => basename($file),
                    "url" => url(Storage::disk("public")->url($file)),
                    "path" => $file,
                    "size" => Storage::disk("public")->size($file),
                    "modified" => Storage::disk("public")->lastModified($file),
                ];
            })
            ->sortByDesc("modified")
            ->values();

        return response()->json($images);
    }

    public function upload(UploadImageRequest $request)
    {
        $image = $request->file("image");

        $filename = Str::uuid() . "." . $image->getClientOriginalExtension();

        $path = $image->storeAs("images/posts", $filename, "public");

        $url = url(Storage::disk("public")->url($path));

        return response()->json([
            "url" => $url,
            "path" => $path,
            "filename" => $filename,
        ]);
    }

    public function delete(string $filename)
    {
        $user = Auth::user();

        if (!$user || !$user->hasAnyRole(["admin", "superadmin"])) {
            return response()->json(["message" => "Unauthorized"], 403);
        }

        $path = "images/posts/" . $filename;

        if (Storage::disk("public")->exists($path)) {
            Storage::disk("public")->delete($path);
            return response()->json([
                "message" => "Image deleted successfully",
            ]);
        }

        return response()->json(["message" => "Image not found"], 404);
    }
}
