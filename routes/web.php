<?php

use App\Http\Controllers\Api\VisitorAuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->group(function () {
    Route::get('/auth/google', [VisitorAuthController::class, 'redirect']);
    Route::get('/auth/google/callback', [VisitorAuthController::class, 'callback']);
});

Route::get("/{any}", function () {
    return view("index");
})->where("any", ".*");
