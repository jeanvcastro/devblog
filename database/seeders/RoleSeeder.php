<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::create(['name' => 'reader']);
        Role::create(['name' => 'editor']);
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'superadmin']);
    }
}
