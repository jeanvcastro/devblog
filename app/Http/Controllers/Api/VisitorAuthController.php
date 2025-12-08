<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class VisitorAuthController extends Controller
{
    public function redirect(Request $request)
    {
        $utmParams = [
            "utm_source" => $request->input("utm_source"),
            "utm_medium" => $request->input("utm_medium"),
            "utm_campaign" => $request->input("utm_campaign"),
            "utm_term" => $request->input("utm_term"),
            "utm_content" => $request->input("utm_content"),
        ];

        $filteredParams = array_filter($utmParams);

        if (!empty($filteredParams)) {
            $cacheKey = "oauth_utm_" . $request->ip() . "_" . time();
            cache()->put($cacheKey, $filteredParams, now()->addMinutes(10));
            cookie()->queue("oauth_utm_key", $cacheKey, 10);
        }

        return Socialite::driver("google")->stateless()->redirect();
    }

    public function callback(Request $request)
    {
        $googleUser = Socialite::driver("google")->stateless()->user();

        $user = User::where("google_id", $googleUser->id)->first();

        if (!$user) {
            $utmParams = [];
            $cacheKey = $request->cookie("oauth_utm_key");
            if ($cacheKey) {
                $utmParams = cache()->get($cacheKey, []);
                cache()->forget($cacheKey);
            }

            $user = User::create(
                array_merge(
                    [
                        "name" => $googleUser->name,
                        "email" => $googleUser->email,
                        "avatar" => $googleUser->avatar,
                        "google_id" => $googleUser->id,
                    ],
                    $utmParams,
                ),
            );

            $user->assignRole("reader");
        }

        $token = $user->createToken("visitor-token")->plainTextToken;

        $redirectUrl = sprintf(
            "/?token=%s&user=%s",
            urlencode($token),
            urlencode(
                json_encode([
                    "uuid" => $user->uuid,
                    "name" => $user->name,
                    "email" => $user->email,
                    "avatar" => $user->avatar,
                    "job_title" => $user->job_title,
                    "bio" => $user->bio,
                    "role" => $user->roles->first()?->name,
                ]),
            ),
        );

        return redirect($redirectUrl);
    }

    public function logout(Request $request)
    {
        $userId = Auth::id();

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            "message" => "Logged out successfully",
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            "uuid" => $user->uuid,
            "name" => $user->name,
            "email" => $user->email,
            "avatar" => $user->avatar,
            "job_title" => $user->job_title,
            "bio" => $user->bio,
            "role" => $user->roles->first()?->name,
        ]);
    }
}
