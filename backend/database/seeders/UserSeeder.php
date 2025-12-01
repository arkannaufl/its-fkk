<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 1 Admin account (highest role)
        User::factory()->admin()->create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@umj.ac.id',
            'phone' => '+62 812-3456-7889',
            'employee_id' => 'ADM001',
            'password' => Hash::make('admin123'),
        ]);

        // Create 1 Dekan account
        User::factory()->dekan()->create([
            'name' => 'Prof. Dr. Ahmad Dahlan, M.Med',
            'username' => 'dekan',
            'email' => 'dekan@umj.ac.id',
            'phone' => '+62 812-3456-7890',
            'employee_id' => 'DKN001',
            'password' => Hash::make('dekan123'),
        ]);

        // Create 4 Unit accounts
        $unitNames = [
            ['name' => 'Dr. Budi Santoso, M.Kes', 'username' => 'unit.akademik', 'email' => 'unit.akademik@umj.ac.id', 'phone' => '+62 812-3456-7891', 'employee_id' => 'UNT001'],
            ['name' => 'Dr. Siti Aminah, M.Pd', 'username' => 'unit.penelitian', 'email' => 'unit.penelitian@umj.ac.id', 'phone' => '+62 812-3456-7892', 'employee_id' => 'UNT002'],
            ['name' => 'Dr. Hendra Wijaya, M.M', 'username' => 'unit.keuangan', 'email' => 'unit.keuangan@umj.ac.id', 'phone' => '+62 812-3456-7893', 'employee_id' => 'UNT003'],
            ['name' => 'Dr. Ratna Dewi, M.Kes', 'username' => 'unit.sdm', 'email' => 'unit.sdm@umj.ac.id', 'phone' => '+62 812-3456-7894', 'employee_id' => 'UNT004'],
        ];

        foreach ($unitNames as $unit) {
            User::factory()->unit()->create([
                'name' => $unit['name'],
                'username' => $unit['username'],
                'email' => $unit['email'],
                'phone' => $unit['phone'],
                'employee_id' => $unit['employee_id'],
                'password' => Hash::make('unit123'),
            ]);
        }

        // Create 8 SDM accounts
        $sdmNames = [
            ['name' => 'Dr. Andi Wijaya, M.Kom', 'username' => 'sdm.andi', 'email' => 'sdm.andi@umj.ac.id', 'phone' => '+62 812-3456-7895', 'employee_id' => 'SDM001'],
            ['name' => 'Dr. Sari Indah, M.Si', 'username' => 'sdm.sari', 'email' => 'sdm.sari@umj.ac.id', 'phone' => '+62 812-3456-7896', 'employee_id' => 'SDM002'],
            ['name' => 'Dr. Bambang Suryanto, M.Sc', 'username' => 'sdm.bambang', 'email' => 'sdm.bambang@umj.ac.id', 'phone' => '+62 812-3456-7897', 'employee_id' => 'SDM003'],
            ['name' => 'Dr. Rina Kusuma, M.Pd', 'username' => 'sdm.rina', 'email' => 'sdm.rina@umj.ac.id', 'phone' => '+62 812-3456-7898', 'employee_id' => 'SDM004'],
            ['name' => 'Dr. Joko Susilo, M.Kes', 'username' => 'sdm.joko', 'email' => 'sdm.joko@umj.ac.id', 'phone' => '+62 812-3456-7899', 'employee_id' => 'SDM005'],
            ['name' => 'Dr. Maya Sari, M.Med', 'username' => 'sdm.maya', 'email' => 'sdm.maya@umj.ac.id', 'phone' => '+62 812-3456-7900', 'employee_id' => 'SDM006'],
            ['name' => 'Dr. Agus Purnomo, M.Sc', 'username' => 'sdm.agus', 'email' => 'sdm.agus@umj.ac.id', 'phone' => '+62 812-3456-7901', 'employee_id' => 'SDM007'],
            ['name' => 'Dr. Dewi Lestari, M.Kes', 'username' => 'sdm.dewi', 'email' => 'sdm.dewi@umj.ac.id', 'phone' => '+62 812-3456-7902', 'employee_id' => 'SDM008'],
        ];

        foreach ($sdmNames as $sdm) {
            User::factory()->sdm()->create([
                'name' => $sdm['name'],
                'username' => $sdm['username'],
                'email' => $sdm['email'],
                'phone' => $sdm['phone'],
                'employee_id' => $sdm['employee_id'],
                'password' => Hash::make('sdm123'),
            ]);
        }
    }
}
