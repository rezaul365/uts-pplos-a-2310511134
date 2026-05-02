<?php

namespace App\Controllers;

use App\Models\DoctorModel;
use CodeIgniter\RESTful\ResourceController;

class DoctorController extends ResourceController
{
    protected $format = 'json';

    public function create()
    {
        $model = new DoctorModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $data['id'] = $model->getInsertID();
            return $this->respondCreated(['status' => 201, 'message' => 'Dokter berhasil ditambahkan', 'data' => $data]);
        }
        return $this->failServerError('Gagal menambah dokter.');
    }

    public function index()
    {
        $model = new DoctorModel();
        return $this->respond(['status' => 200, 'data' => $model->findAll()]);
    }

    public function show($id = null)
    {
        $model = new DoctorModel();
        $data = $model->find($id);
        if ($data) return $this->respond(['status' => 200, 'data' => $data]);
        return $this->failNotFound('Dokter tidak ditemukan.');
    }

    public function update($id = null)
    {
        $model = new DoctorModel();
        $data = $this->request->getJSON(true);
        if ($model->update($id, $data)) return $this->respond(['status' => 200, 'message' => 'Data dokter diperbarui']);
        return $this->failServerError('Gagal memperbarui data.');
    }

    public function delete($id = null)
    {
        $model = new DoctorModel();
        if ($model->delete($id)) return $this->respondDeleted(['status' => 200, 'message' => 'Dokter dihapus']);
        return $this->failNotFound('Dokter tidak ditemukan.');
    }
}