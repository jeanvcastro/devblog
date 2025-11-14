<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadImageRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(UploadImageRequest $request)
    {
        $image = $request->file('image');

        $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();

        $path = $image->storeAs('images/posts', $filename, 'public');

        $url = Storage::disk('public')->url($path);

        return response()->json([
            'url' => $url,
            'path' => $path,
            'filename' => $filename,
        ]);
    }

    public function delete(string $filename)
    {
        $user = Auth::user();

        if (!$user || !$user->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $path = 'images/posts/' . $filename;

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
            return response()->json(['message' => 'Image deleted successfully']);
        }

        return response()->json(['message' => 'Image not found'], 404);
    }
}
