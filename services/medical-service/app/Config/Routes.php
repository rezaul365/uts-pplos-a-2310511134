<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->post('api/patients', 'PatientController::create'); // Create
$routes->get('api/patients', 'PatientController::index');  // Read All
$routes->get('api/patients/(:num)', 'PatientController::show/$1'); // Read One (berdasarkan ID)
$routes->put('api/patients/(:num)', 'PatientController::update/$1'); // Update
$routes->delete('api/patients/(:num)', 'PatientController::delete/$1'); // Delete
