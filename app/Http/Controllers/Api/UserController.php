<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::with('roles')
            ->orderBy('name')
            ->get()
            ->map(fn ($user) => [
                'uuid' => $user->uuid,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role' => $user->roles->first()?->name,
                'created_at' => $user->created_at,
            ]);

        return response()->json($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        return response()->json([
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'role' => $request->role,
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'role' => $user->roles->first()?->name,
            'created_at' => $user->created_at,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->only(['name', 'email']);

        $user->update($data);

        if ($request->filled('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json([
            'uuid' => $user->uuid,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'role' => $user->roles->first()?->name,
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function resetPassword(Request $request, User $user): JsonResponse
    {
        $this->authorize('update', $user);

        $request->validate([
            'password' => 'required|string|min:8',
        ]);

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'Password reset successfully',
        ]);
    }
}
