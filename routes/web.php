<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Public routes
Route::get('/', function () {
    return redirect('/calendar');
});

// Health check endpoint for Docker
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toISOString(),
        'app' => config('app.name'),
        'version' => '1.0.0'
    ]);
});

Route::get('/calendar', [EventController::class, 'index'])->name('calendar.index');

// Protected routes (require authentication)
Route::middleware(['ensureAuthenticated'])->group(function () {
    Route::post('/calendar/events', [EventController::class, 'store'])->name('events.store');
    Route::put('/calendar/events/{id}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/calendar/events/{id}', [EventController::class, 'destroy'])->name('events.destroy');
});

// SAML Auth routes (these would be handled by the hydra-saml-auth middleware)
Route::get('/login', function () {
    return redirect('https://hydra.newpaltz.edu/login');
})->name('login');

Route::post('/logout', function () {
    auth()->logout();
    return redirect('/calendar');
})->name('logout');
