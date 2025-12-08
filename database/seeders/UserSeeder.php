<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            "name" => "Admin User",
            "email" => "admin@devbroder.com",
            "password" => Hash::make("password"),
        ]);
        $admin->assignRole("admin");

        $editor = User::create([
            "name" => "Editor User",
            "email" => "editor@devbroder.com",
            "password" => Hash::make("password"),
        ]);
        $editor->assignRole("editor");

        $reader = User::create([
            "name" => "Reader User",
            "email" => "reader@devbroder.com",
            "password" => Hash::make("password"),
        ]);
        $reader->assignRole("reader");
    }
}
