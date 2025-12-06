<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();

        $user->update($request->only(['name']));

        return response()->json([
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role' => $user->roles->first()?->name,
            ],
        ]);
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $user = $request->user();

        if ($user->avatar && str_contains($user->avatar, 'images/avatars/')) {
            $oldPath = parse_url($user->avatar, PHP_URL_PATH);
            $oldPath = ltrim(str_replace('/storage/', '', $oldPath), '/');
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $image = $request->file('avatar');
        $filename = $user->uuid . '_' . time() . '.' . $image->getClientOriginalExtension();
        $path = $image->storeAs('images/avatars', $filename, 'public');
        $url = url(Storage::disk('public')->url($path));

        $user->update(['avatar' => $url]);

        return response()->json([
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role' => $user->roles->first()?->name,
            ],
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!$user->password) {
            return response()->json([
                'message' => 'No password set. Please login with Google.',
            ], 400);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password changed successfully.',
        ]);
    }

    public function unlinkGoogle(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->password) {
            return response()->json([
                'message' => 'Cannot unlink Google account without a password set.',
            ], 400);
        }

        $user->update([
            'google_id' => null,
        ]);

        return response()->json([
            'message' => 'Google account unlinked successfully.',
        ]);
    }

    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->avatar && str_contains($user->avatar, 'images/avatars/')) {
            $oldPath = parse_url($user->avatar, PHP_URL_PATH);
            $oldPath = ltrim(str_replace('/storage/', '', $oldPath), '/');
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }

        $user->update(['avatar' => null]);

        return response()->json([
            'user' => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => null,
                'role' => $user->roles->first()?->name,
            ],
        ]);
    }
}
