<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ImageUploadController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PostViewController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VisitorAuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:api')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/most-viewed', [PostController::class, 'mostViewed']);
    Route::get('/posts/recent', [PostController::class, 'recent']);
    Route::get('/posts/search', [PostController::class, 'search']);
    Route::get('/posts/{post:uuid}', [PostController::class, 'show']);

    Route::get('/tags', [TagController::class, 'index']);
    Route::get('/tags/{tag:uuid}', [TagController::class, 'show']);

    Route::get('/posts/{post:uuid}/comments', [CommentController::class, 'index']);
});

Route::middleware('throttle:views')->group(function () {
    Route::post('/posts/{post:uuid}/track-view', [PostViewController::class, 'track']);
});

Route::middleware('throttle:auth')->group(function () {
    Route::post('/admin/login', [AdminAuthController::class, 'login']);
});

Route::middleware(['auth:sanctum', 'throttle:authenticated'])->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/me', [AdminAuthController::class, 'me']);

    Route::post('/auth/logout', [VisitorAuthController::class, 'logout']);
    Route::get('/auth/me', [VisitorAuthController::class, 'me']);

    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::put('/profile/password', [ProfileController::class, 'changePassword']);
    Route::delete('/profile/google', [ProfileController::class, 'unlinkGoogle']);

    Route::middleware('throttle:comments')->group(function () {
        Route::post('/comments', [CommentController::class, 'store']);
    });

    Route::middleware('admin')->group(function () {
        Route::post('/posts', [PostController::class, 'store']);
        Route::put('/posts/{post:uuid}', [PostController::class, 'update']);
        Route::delete('/posts/{post:uuid}', [PostController::class, 'destroy']);

        Route::post('/tags', [TagController::class, 'store']);
        Route::put('/tags/{tag:uuid}', [TagController::class, 'update']);
        Route::delete('/tags/{tag:uuid}', [TagController::class, 'destroy']);

        Route::get('/admin/comments', [CommentController::class, 'adminIndex']);
        Route::put('/comments/{comment:uuid}/approve', [CommentController::class, 'approve']);
        Route::put('/comments/{comment:uuid}/reject', [CommentController::class, 'reject']);
        Route::delete('/comments/{comment:uuid}', [CommentController::class, 'destroy']);

        Route::middleware('throttle:uploads')->group(function () {
            Route::post('/images/upload', [ImageUploadController::class, 'upload']);
        });

        Route::get('/images', [ImageUploadController::class, 'index']);
        Route::delete('/images/{filename}', [ImageUploadController::class, 'delete']);
    });

    Route::middleware('role:superadmin')->group(function () {
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::post('/admin/users', [UserController::class, 'store']);
        Route::get('/admin/users/{user:uuid}', [UserController::class, 'show']);
        Route::put('/admin/users/{user:uuid}', [UserController::class, 'update']);
        Route::delete('/admin/users/{user:uuid}', [UserController::class, 'destroy']);
        Route::put('/admin/users/{user:uuid}/password', [UserController::class, 'resetPassword']);
    });
});
