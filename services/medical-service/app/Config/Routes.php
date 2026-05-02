<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
// Patients
$routes->get('/', 'Home::index');
$routes->post('api/patients', 'PatientController::create'); // Create
$routes->get('api/patients', 'PatientController::index');  // Read All
$routes->get('api/patients/(:num)', 'PatientController::show/$1'); // Read One (berdasarkan ID)
$routes->put('api/patients/(:num)', 'PatientController::update/$1'); // Update
$routes->delete('api/patients/(:num)', 'PatientController::delete/$1'); // Delete

// Rute Lengkap CRUD Doctors
$routes->post('api/doctors', 'DoctorController::create');
$routes->get('api/doctors', 'DoctorController::index');
$routes->get('api/doctors/(:num)', 'DoctorController::show/$1');
$routes->put('api/doctors/(:num)', 'DoctorController::update/$1');
$routes->delete('api/doctors/(:num)', 'DoctorController::delete/$1');
