<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = \App\Models\Post::all();
        $users = \App\Models\User::role("reader")->get();

        foreach ($posts->take(5) as $post) {
            foreach ($users as $user) {
                \App\Models\Comment::create([
                    "post_id" => $post->id,
                    "user_id" => $user->id,
                    "content" => "Excelente artigo! Muito bem explicado.",
                    "approved" => true,
                ]);
            }

            \App\Models\Comment::create([
                "post_id" => $post->id,
                "user_id" => $users->first()->id,
                "content" => "Aguardando aprovação...",
                "approved" => false,
            ]);
        }
    }
}
