<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $joao = \App\Models\User::create([
            'name' => 'João Silva',
            'email' => 'joao@example.com',
            'password' => bcrypt('password'),
        ]);
        $joao->assignRole('reader');

        $maria = \App\Models\User::create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'password' => bcrypt('password'),
        ]);
        $maria->assignRole('reader');
    }
}
