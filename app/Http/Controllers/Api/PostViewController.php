<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\PostView;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class PostViewController extends Controller
{
    public function track(Request $request, Post $post)
    {
        $visitorHash = $this->generateVisitorHash($request);
        $today = Carbon::today()->toDateString();

        $existingView = PostView::where('post_id', $post->id)
            ->where('visitor_hash', $visitorHash)
            ->whereDate('visited_at', $today)
            ->first();

        if (!$existingView) {
            PostView::create([
                'post_id' => $post->id,
                'visitor_hash' => $visitorHash,
                'user_id' => Auth::id(),
                'visited_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'View tracked successfully',
            'views_count' => $post->fresh()->views_count,
        ]);
    }

    private function generateVisitorHash(Request $request)
    {
        $ip = $request->ip();
        $userAgent = $request->userAgent();

        return hash('sha256', $ip . $userAgent);
    }
}
