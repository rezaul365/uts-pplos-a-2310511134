<?php

namespace App\Controllers;

use App\Models\PatientModel;
use CodeIgniter\RESTful\ResourceController;

class PatientController extends ResourceController
{
    protected $format = 'json'; // Format balasan otomatis JSON

    // Fungsi untuk menerima data dari luar dan menyimpannya ke database
    public function create()
    {
        $model = new PatientModel();
        
        // Menangkap data JSON yang dikirim (misal dari Postman atau Auth Service)
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $data['id'] = $model->getInsertID(); // Ambil ID yang baru saja terbuat
            return $this->respondCreated([
                'status'  => 201,
                'message' => 'Data pasien berhasil didaftarkan!',
                'data'    => $data
            ]);
        }

        return $this->failServerError('Waduh, gagal menyimpan data pasien.');
    }
}