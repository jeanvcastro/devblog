<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Admin User',
            'email' => 'admin@techblog.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=Admin+User',
        ]);

        \App\Models\User::create([
            'name' => 'João Silva',
            'email' => 'joao@example.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=Joao+Silva',
        ]);

        \App\Models\User::create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
            'avatar' => 'https://ui-avatars.com/api/?name=Maria+Santos',
        ]);
    }
}
