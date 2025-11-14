<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@techblog.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
            'avatar' => 'https://ui-avatars.com/api/?name=Admin&background=FF4800&color=fff',
        ]);
    }
}
