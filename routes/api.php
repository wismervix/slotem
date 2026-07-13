<?php

use App\Http\Controllers\Api\ChatController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {


    Route::get('/test', function () {
        return response()->json([
            'message' => 'API working'
        ]);
    });
    // AI Chat
    Route::post('/chat', [ChatController::class, 'sendMessage']);
});
