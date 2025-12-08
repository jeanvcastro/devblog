<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class PostViewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = \App\Models\Post::all();

        $viewCounts = [150, 120, 89, 200, 75, 45, 30, 15];

        foreach ($posts as $index => $post) {
            $viewCount = $viewCounts[$index] ?? 10;

            for ($i = 0; $i < $viewCount; $i++) {
                \App\Models\PostView::create([
                    "post_id" => $post->id,
                    "visitor_hash" => hash(
                        "sha256",
                        "visitor_" . $i . "_" . $post->id,
                    ),
                    "user_id" => null,
                    "visited_at" => now()->subDays(rand(0, 30)),
                ]);
            }
        }
    }
}
