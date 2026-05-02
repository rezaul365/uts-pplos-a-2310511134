<?php

namespace App\Controllers;

use App\Models\PrescriptionModel;
use CodeIgniter\RESTful\ResourceController;

class PrescriptionController extends ResourceController
{
    protected $format = 'json';

    public function create()
    {
        $model = new PrescriptionModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $data['id'] = $model->getInsertID();
            return $this->respondCreated(['status' => 201, 'message' => 'Resep berhasil dibuat', 'data' => $data]);
        }
        return $this->failServerError('Gagal membuat resep.');
    }

    public function index()
    {
        $model = new PrescriptionModel();
        return $this->respond(['status' => 200, 'data' => $model->findAll()]);
    }

    public function show($id = null)
    {
        $model = new PrescriptionModel();
        $data = $model->find($id);
        if ($data) return $this->respond(['status' => 200, 'data' => $data]);
        return $this->failNotFound('Resep tidak ditemukan.');
    }

    public function update($id = null)
    {
        $model = new PrescriptionModel();
        $data = $this->request->getJSON(true);
        if ($model->update($id, $data)) return $this->respond(['status' => 200, 'message' => 'Resep diperbarui']);
        return $this->failServerError('Gagal memperbarui resep.');
    }

    public function delete($id = null)
    {
        $model = new PrescriptionModel();
        if ($model->delete($id)) return $this->respondDeleted(['status' => 200, 'message' => 'Resep dihapus']);
        return $this->failNotFound('Resep tidak ditemukan.');
    }
}