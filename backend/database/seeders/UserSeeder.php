<?php

namespace Database\Seeders;

use App\Models\Unit;
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
        // Create Admin account
        User::factory()->admin()->create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@umj.ac.id',
            'phone' => '+62 812-3456-7889',
            'employee_id' => 'ADM001',
            'password' => Hash::make('admin123'),
        ]);

        // Get units for assignment
        $dekanUnit = Unit::where('code', 'DEKAN')->first();
        $wadekIUnit = Unit::where('code', 'WADEK_1')->first();
        $wadekIIUnit = Unit::where('code', 'WADEK_2')->first();
        $unitPPDS = Unit::where('code', 'KA_PRODI_PPDS')->first();

        // Create and Assign Dekan to Dekan unit
        if ($dekanUnit) {
        User::factory()->dekan()->create([
                'name' => 'Prof. Dr. Ahmad Hidayat, Sp.PD',
            'username' => 'dekan',
            'email' => 'dekan@umj.ac.id',
            'phone' => '+62 812-3456-7890',
                'employee_id' => 'DEK001',
                'password' => Hash::make('password'),
                'unit_id' => $dekanUnit->id,
                'role' => $dekanUnit->role,
                'assigned_at' => now(),
            ]);
        }

        // Create and Assign Wadek I
        if ($wadekIUnit) {
            User::factory()->unit()->create([
                'name' => 'Dr. Siti Nurhaliza, M.Kes',
                'username' => 'wadek1',
                'email' => 'wadek1@umj.ac.id',
                'phone' => '+62 812-3456-7891',
                'employee_id' => 'WAD001',
                'password' => Hash::make('password'),
                'unit_id' => $wadekIUnit->id,
                'role' => $wadekIUnit->role,
                'assigned_at' => now(),
            ]);
        }

        // Create and Assign Wadek II
        if ($wadekIIUnit) {
            User::factory()->unit()->create([
                'name' => 'Dr. Budi Santoso, Sp.M',
                'username' => 'wadek2',
                'email' => 'wadek2@umj.ac.id',
                'phone' => '+62 812-3456-7892',
                'employee_id' => 'WAD002',
                'password' => Hash::make('password'),
                'unit_id' => $wadekIIUnit->id,
                'role' => $wadekIIUnit->role,
                'assigned_at' => now(),
            ]);
        }

        // Assign user to Unit PPDS
        if ($unitPPDS) {
            User::factory()->unit()->create([
                'name' => 'Rizqi Irkam Maulana, S.Kom',
                'username' => 'rizqi.irkam',
                'email' => 'rizqiirkhammaulana@umj.ac.id',
                'phone' => '+62 812-3456-7893',
                'employee_id' => 'UNT001',
                'password' => Hash::make('password'),
                'unit_id' => $unitPPDS->id,
                'role' => $unitPPDS->role,
                'assigned_at' => now(),
            ]);
        }

        // Create Arkan Naufal (unassigned for now, can be assigned to Wadek)
        User::factory()->unit()->create([
            'name' => 'Arkan Naufal Ardiansyah, S.Kom',
            'username' => 'arkan.naufal',
            'email' => 'arkannaufal024@umj.ac.id',
            'phone' => '+62 812-3456-7894',
            'employee_id' => 'UNT002',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dr. Muhammad Fauzi, Sp.PD',
            'username' => 'muhammad.fauzi',
            'email' => 'muhammad.fauzi@umj.ac.id',
            'phone' => '+62 812-3456-7895',
            'employee_id' => 'UNT003',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dr. Siti Aisyah, Sp.A',
            'username' => 'siti.aisyah',
            'email' => 'siti.aisyah@umj.ac.id',
            'phone' => '+62 812-3456-7896',
            'employee_id' => 'UNT004',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dr. Ahmad Rizki, Sp.OG',
            'username' => 'ahmad.rizki',
            'email' => 'ahmad.rizki@umj.ac.id',
            'phone' => '+62 812-3456-7897',
            'employee_id' => 'UNT005',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dr. Indah Sari, Sp.GK',
            'username' => 'indah.sari',
            'email' => 'indah.sari@umj.ac.id',
            'phone' => '+62 812-3456-7898',
            'employee_id' => 'UNT006',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dewi Lestari, S.Keb',
            'username' => 'dewi.lestari',
            'email' => 'dewi.lestari@umj.ac.id',
            'phone' => '+62 812-3456-7899',
            'employee_id' => 'UNT007',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Bambang Wijaya, S.E',
            'username' => 'bambang.wijaya',
            'email' => 'bambang.wijaya@umj.ac.id',
            'phone' => '+62 812-3456-7900',
            'employee_id' => 'UNT008',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dr. Rina Kartika, M.Kes',
            'username' => 'rina.kartika',
            'email' => 'rina.kartika@umj.ac.id',
            'phone' => '+62 812-3456-7901',
            'employee_id' => 'UNT009',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dr. Agus Prasetyo, Sp.B',
            'username' => 'agus.prasetyo',
            'email' => 'agus.prasetyo@umj.ac.id',
            'phone' => '+62 812-3456-7902',
            'employee_id' => 'UNT010',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Sari Indrawati, S.Si',
            'username' => 'sari.indrawati',
            'email' => 'sari.indrawati@umj.ac.id',
            'phone' => '+62 812-3456-7903',
            'employee_id' => 'UNT011',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Ahmad Yudha, S.Kom',
            'username' => 'ahmad.yudha',
            'email' => 'ahmad.yudha@umj.ac.id',
            'phone' => '+62 812-3456-7904',
            'employee_id' => 'UNT012',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dr. Fitri Handayani, M.Kes',
            'username' => 'fitri.handayani',
            'email' => 'fitri.handayani@umj.ac.id',
            'phone' => '+62 812-3456-7905',
            'employee_id' => 'UNT013',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Dr. Eko Setiawan, Sp.P',
            'username' => 'eko.setiawan',
            'email' => 'eko.setiawan@umj.ac.id',
            'phone' => '+62 812-3456-7906',
            'employee_id' => 'UNT014',
            'password' => Hash::make('password'),
        ]);

        User::factory()->unit()->create([
            'name' => 'Lina Marlina, S.Kep',
            'username' => 'lina.marlina',
            'email' => 'lina.marlina@umj.ac.id',
            'phone' => '+62 812-3456-7907',
            'employee_id' => 'UNT015',
            'password' => Hash::make('password'),
        ]);

        // Create SDM users (unassigned)
        User::factory()->sdm()->create([
            'name' => 'Siti Nurhaliza',
            'username' => 'siti.nurhaliza',
            'email' => 'siti.nurhaliza@umj.ac.id',
            'phone' => '+62 812-3456-7908',
            'employee_id' => 'SDM001',
            'password' => Hash::make('password'),
        ]);

        User::factory()->sdm()->create([
            'name' => 'Budi Santoso',
            'username' => 'budi.santoso',
            'email' => 'budi.santoso@umj.ac.id',
            'phone' => '+62 812-3456-7909',
            'employee_id' => 'SDM002',
            'password' => Hash::make('password'),
        ]);

        User::factory()->sdm()->create([
            'name' => 'Ayu Lestari',
            'username' => 'ayu.lestari',
            'email' => 'ayu.lestari@umj.ac.id',
            'phone' => '+62 812-3456-7910',
            'employee_id' => 'SDM003',
            'password' => Hash::make('password'),
        ]);

        User::factory()->sdm()->create([
            'name' => 'Dedi Kurniawan',
            'username' => 'dedi.kurniawan',
            'email' => 'dedi.kurniawan@umj.ac.id',
            'phone' => '+62 812-3456-7911',
            'employee_id' => 'SDM004',
            'password' => Hash::make('password'),
        ]);
    }
}

