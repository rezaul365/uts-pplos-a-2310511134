<?php

namespace App\Controllers;

use App\Models\PatientModel;
use CodeIgniter\RESTful\ResourceController;

class PatientController extends ResourceController
{
    protected $format = 'json';

    // 1. CREATE (Tambah Pasien)
    public function create()
    {
        $model = new PatientModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $data['id'] = $model->getInsertID();
            return $this->respondCreated([
                'status'  => 201,
                'message' => 'Data pasien berhasil didaftarkan!',
                'data'    => $data
            ]);
        }
        return $this->failServerError('Gagal menyimpan data pasien.');
    }

    // 2. READ ALL (Lihat Semua Pasien)
    public function index()
    {
        $model = new PatientModel();
        return $this->respond([
            'status' => 200,
            'data'   => $model->findAll()
        ]);
    }

    // 3. READ ONE (Lihat 1 Pasien Berdasarkan ID)
    public function show($id = null)
    {
        $model = new PatientModel();
        $data = $model->find($id);
        
        if ($data) {
            return $this->respond(['status' => 200, 'data' => $data]);
        }
        return $this->failNotFound('Data pasien tidak ditemukan.');
    }

    // 4. UPDATE (Ubah Data Pasien)
    public function update($id = null)
    {
        $model = new PatientModel();
        $data = $this->request->getJSON(true); // Ambil data JSON baru

        if ($model->update($id, $data)) {
            return $this->respond([
                'status'  => 200,
                'message' => 'Data pasien berhasil diubah!'
            ]);
        }
        return $this->failServerError('Gagal mengubah data pasien.');
    }

    // 5. DELETE (Hapus Data Pasien)
    public function delete($id = null)
    {
        $model = new PatientModel();
        
        if ($model->delete($id)) {
            return $this->respondDeleted([
                'status'  => 200,
                'message' => 'Data pasien berhasil dihapus!'
            ]);
        }
        return $this->failNotFound('Data pasien tidak ditemukan atau gagal dihapus.');
    }
}