<?php

namespace App\Controllers;

use App\Models\ScheduleModel;
use CodeIgniter\RESTful\ResourceController;

class ScheduleController extends ResourceController
{
    protected $format = 'json';

    public function create()
    {
        $model = new ScheduleModel();
        $data = $this->request->getJSON(true);

        if ($model->insert($data)) {
            $data['id'] = $model->getInsertID();
            return $this->respondCreated(['status' => 201, 'message' => 'Jadwal dokter berhasil ditambahkan', 'data' => $data]);
        }
        return $this->failServerError('Gagal menambah jadwal.');
    }

    public function index()
    {
        $model = new ScheduleModel();
        return $this->respond(['status' => 200, 'data' => $model->findAll()]);
    }

    public function show($id = null)
    {
        $model = new ScheduleModel();
        $data = $model->find($id);
        if ($data) return $this->respond(['status' => 200, 'data' => $data]);
        return $this->failNotFound('Jadwal tidak ditemukan.');
    }

    public function update($id = null)
    {
        $model = new ScheduleModel();
        $data = $this->request->getJSON(true);
        if ($model->update($id, $data)) return $this->respond(['status' => 200, 'message' => 'Jadwal diperbarui']);
        return $this->failServerError('Gagal memperbarui jadwal.');
    }

    public function delete($id = null)
    {
        $model = new ScheduleModel();
        if ($model->delete($id)) return $this->respondDeleted(['status' => 200, 'message' => 'Jadwal dihapus']);
        return $this->failNotFound('Jadwal tidak ditemukan.');
    }
}