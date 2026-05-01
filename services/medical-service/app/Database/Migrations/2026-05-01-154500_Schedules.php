<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Schedules extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'doctor_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true, // Harus sama dengan tipe ID di tabel doctors
            ],
            'day' => [
                'type'       => 'VARCHAR',
                'constraint' => '20', // Contoh: Senin, Selasa
            ],
            'start_time' => [
                'type' => 'TIME', // Jam mulai praktik
            ],
            'end_time' => [
                'type' => 'TIME', // Jam selesai praktik
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        
        $this->forge->addKey('id', true);
        // Menghubungkan jadwal ini dengan ID dokter di tabel doctors
        $this->forge->addForeignKey('doctor_id', 'doctors', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('schedules');
    }

    public function down()
    {
        $this->forge->dropTable('schedules');
    }
}