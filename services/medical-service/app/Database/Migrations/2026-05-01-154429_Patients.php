<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class Patients extends Migration
{
    public function up()
    {
        //Kita definisikan kolom-kolom untuk tabel pasien
        $this->forge->addField([
            'id' => [
                'type' => 'INT',
                'constraint' => 11,
                'unsigned' => true,
                'auto_increment' => true,
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
            ],
            'nik' => [
                'type' => 'VARCHAR',
                'constraint' => '16',
                'unique' => true,
            ],
            'phone' => [
                'type' => 'VARChAR', 
                'constraint' => '20',
                'unique' => true,
            ],
            'address' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'created_t' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        # Kita jadikan kolom id sebagai primary key
        $this->forge->addKey('id', true);
        # Kita memperintaahkan CI4 untuk membuat tabel "patients"
        $this->forge->createTable('patients');

    }

    public function down()
    {
        # Perintah untuk menghapus tabel jika kita membatalkan migration
        $this->forge->dropTable('patients');
    }
}
