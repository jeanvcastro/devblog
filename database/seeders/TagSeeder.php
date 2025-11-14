<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            ['name' => 'Arquitetura', 'slug' => 'arquitetura'],
            ['name' => 'Frontend', 'slug' => 'frontend'],
            ['name' => 'Backend', 'slug' => 'backend'],
            ['name' => 'Performance', 'slug' => 'performance'],
            ['name' => 'DevOps', 'slug' => 'devops'],
            ['name' => 'TypeScript', 'slug' => 'typescript'],
            ['name' => 'React', 'slug' => 'react'],
            ['name' => 'Sistemas Distribuídos', 'slug' => 'sistemas-distribuidos'],
        ];

        foreach ($tags as $tag) {
            \App\Models\Tag::create($tag);
        }
    }
}
