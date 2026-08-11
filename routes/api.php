<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\HelpCenterChatController;

Route::prefix('api')->group(function () {


    Route::get('/test', function () {
        return response()->json([
            'message' => 'API working'
        ]);
    });

    // Sales AI Chat
    Route::post('/chat', [ChatController::class, 'sendMessage']);

    // Help Center AI Chat
    Route::post('/help-center/chat', [HelpCenterChatController::class, 'sendMessage']);
});
