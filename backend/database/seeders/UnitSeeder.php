<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Root Unit: Dekan
        $dekan = Unit::create([
            'code' => 'DEKAN',
            'name' => 'Dekan',
            'type' => Unit::TYPE_UNIT,
            'role' => 'dekan',
            'parent_unit_id' => null,
            'description' => 'Dekan Fakultas',
            'is_active' => true,
        ]);

        // Wakil Dekan I
        $wadekI = Unit::create([
            'code' => 'WADEK_1',
            'name' => 'Wakil Dekan I',
            'type' => Unit::TYPE_WADEK_I,
            'role' => 'wadek',
            'parent_unit_id' => $dekan->id,
            'description' => 'Wakil Dekan Bidang Akademik',
            'is_active' => true,
        ]);

        // Wakil Dekan II
        $wadekII = Unit::create([
            'code' => 'WADEK_2',
            'name' => 'Wakil Dekan II',
            'type' => Unit::TYPE_WADEK_II,
            'role' => 'wadek',
            'parent_unit_id' => $dekan->id,
            'description' => 'Wakil Dekan Bidang Non-Akademik',
            'is_active' => true,
        ]);

        // Units under Wakil Dekan I
        $bakordik = Unit::create([
            'code' => 'BAKORDIK',
            'name' => 'Badan Koordinasi Pendidikan',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekI->id,
            'description' => 'Badan Koordinasi Pendidikan',
            'is_active' => true,
        ]);

        $unitPPDS = Unit::create([
            'code' => 'KA_PRODI_PPDS',
            'name' => 'Unit PPDS',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $bakordik->id,
            'description' => 'Kepala Program Studi PPDS',
            'is_active' => true,
        ]);

        $unitPSKd = Unit::create([
            'code' => 'KA_PRODI_PSKD',
            'name' => 'Unit PSKd',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $bakordik->id,
            'description' => 'Kepala Program Studi PSKd',
            'is_active' => true,
        ]);

        $unitPSPD = Unit::create([
            'code' => 'KA_PRODI_PSPD',
            'name' => 'Unit PSPD',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $bakordik->id,
            'description' => 'Kepala Program Studi PSPD',
            'is_active' => true,
        ]);

        $prodiKebidanan = Unit::create([
            'code' => 'KA_PRODI_S1_KEBIDANAN',
            'name' => 'Ka. Prodi S1 Kebidanan',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekI->id,
            'description' => 'Kepala Program Studi S1 Kebidanan',
            'is_active' => true,
        ]);

        $prodiProfesiBidan = Unit::create([
            'code' => 'KA_PRODI_PROFESI_BIDAN',
            'name' => 'Ka. Prodi Profesi Bidan',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekI->id,
            'description' => 'Kepala Program Studi Profesi Bidan',
            'is_active' => true,
        ]);

        $prodiGizi = Unit::create([
            'code' => 'KA_PRODI_GIZI',
            'name' => 'Ka. Prodi Gizi',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekI->id,
            'description' => 'Kepala Program Studi Gizi',
            'is_active' => true,
        ]);

        $kabagTU = Unit::create([
            'code' => 'KABAG_TU',
            'name' => 'Kabag. TU',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekI->id,
            'description' => 'Kepala Bagian Tata Usaha',
            'is_active' => true,
        ]);

        // Units under Wakil Dekan II
        $koordDeptPreklinik = Unit::create([
            'code' => 'KOORD_DEPT_PREKLINIK',
            'name' => 'Koord Dept Preklinik',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Koordinator Departemen Preklinik',
            'is_active' => true,
        ]);

        $koordDeptKlinik = Unit::create([
            'code' => 'KOORD_DEPT_KLINIK',
            'name' => 'Koord Dept Klinik',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Koordinator Departemen Klinik',
            'is_active' => true,
        ]);

        $koordLabAnatomi = Unit::create([
            'code' => 'KOORD_LAB_ANATOMI',
            'name' => 'Koord Lab Anatomi',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Koordinator Laboratorium Anatomi',
            'is_active' => true,
        ]);

        $koordLabBiomedik = Unit::create([
            'code' => 'KOORD_LAB_BIOMEDIK',
            'name' => 'Koord Lab Biomedik',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Koordinator Laboratorium Biomedik',
            'is_active' => true,
        ]);

        $unitAkademik = Unit::create([
            'code' => 'UNIT_AKADEMIK',
            'name' => 'Unit Pelaksana Akademik',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Unit Pelaksana Akademik, Kemahasiswaan, Kerja sama, AIK, dan PMB',
            'is_active' => true,
        ]);

        $unitPerpustakaan = Unit::create([
            'code' => 'UNIT_PERPUSTAKAAN',
            'name' => 'Unit Pelaksana Perpustakaan',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Unit Pelaksana Perpustakaan',
            'is_active' => true,
        ]);

        $unitTI = Unit::create([
            'code' => 'UNIT_TI',
            'name' => 'Unit Pelaksana Teknologi Informasi',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Unit Pelaksana Teknologi Informasi',
            'is_active' => true,
        ]);

        $upkk = Unit::create([
            'code' => 'UPKK',
            'name' => 'Unit Pendidikan Kedokteran Kesehatan',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Unit Pendidikan Kedokteran Kesehatan',
            'is_active' => true,
        ]);

        $koordKurikulumSarjana = Unit::create([
            'code' => 'KOORD_KURIKULUM_SARJANA',
            'name' => 'Koord Kurikulum Sarjana',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $upkk->id,
            'description' => 'Koordinator Kurikulum Sarjana',
            'is_active' => true,
        ]);

        $koordKurikulumProfesi = Unit::create([
            'code' => 'KOORD_KURIKULUM_PROFESI',
            'name' => 'Koord Kurikulum Profesi',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $upkk->id,
            'description' => 'Koordinator Kurikulum Profesi',
            'is_active' => true,
        ]);

        $koordAsesmen = Unit::create([
            'code' => 'KOORD_ASESMEN_IBA',
            'name' => 'Koord Asesmen dan Item Bank Analysis',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $upkk->id,
            'description' => 'Koordinator Asesmen dan Item Bank Analysis (IBA)',
            'is_active' => true,
        ]);

        $komisiEtik = Unit::create([
            'code' => 'KOMISI_ETIK_DISIPLIN',
            'name' => 'Komisi Etik dan Disiplin',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Komisi Etik dan Disiplin',
            'is_active' => true,
        ]);

        $lembagaPenelitian = Unit::create([
            'code' => 'LEMBAGA_PENELITIAN',
            'name' => 'Lembaga Penelitian dan Pengmas',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Lembaga Penelitian dan Pengabdian Masyarakat',
            'is_active' => true,
        ]);

        $badanPenjaminanMutu = Unit::create([
            'code' => 'BADAN_PENJAMINAN_MUTU',
            'name' => 'Badan Penjaminan Mutu',
            'type' => Unit::TYPE_UNIT,
            'role' => 'unit',
            'parent_unit_id' => $wadekII->id,
            'description' => 'Badan Penjaminan Mutu',
            'is_active' => true,
        ]);
    }
}

