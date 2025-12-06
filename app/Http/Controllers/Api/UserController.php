<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = User::with("roles")->orderBy("name");

        if ($search = $request->input("q")) {
            $query->where(function ($q) use ($search) {
                $q->where("name", "like", "%{$search}%")->orWhere(
                    "email",
                    "like",
                    "%{$search}%",
                );
            });
        }

        if ($role = $request->input("role")) {
            $query->whereHas("roles", fn($q) => $q->where("name", $role));
        }

        return UserResource::collection($query->paginate(10));
    }

    public function store(StoreUserRequest $request): UserResource
    {
        $user = User::create([
            "name" => $request->name,
            "email" => $request->email,
            "password" => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);
        $user->load("roles");

        return new UserResource($user);
    }

    public function show(User $user): UserResource
    {
        $user->load("roles");

        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $user->update($request->only(["name", "email"]));

        if ($request->filled("role")) {
            $user->syncRoles([$request->role]);
        }

        $user->load("roles");

        return new UserResource($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->authorize("delete", $user);

        $user->delete();

        return response()->json(["message" => "User deleted successfully"]);
    }

    public function resetPassword(Request $request, User $user): JsonResponse
    {
        $this->authorize("update", $user);

        $request->validate([
            "password" => "required|string|min:8",
        ]);

        $user->update([
            "password" => Hash::make($request->password),
        ]);

        return response()->json([
            "message" => "Password reset successfully",
        ]);
    }
}
