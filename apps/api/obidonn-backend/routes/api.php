<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConsultationBookingController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show'])->where('id', '[0-9]+');
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{slug}', [CategoryController::class, 'show']);
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{number}', [OrderController::class, 'show']);
Route::post('/consultations', [ConsultationBookingController::class, 'store']);
