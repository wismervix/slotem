<?php

use Illuminate\Support\Facades\Route;

it('redirects unauthenticated user requests to the user login page', function (): void {
    Route::middleware('auth')->get('/test-user-protected', fn () => 'ok')->name('test.user.protected');

    $response = $this->get('/test-user-protected');

    $response->assertRedirect('/user/login');
});

it('redirects unauthenticated admin requests to the admin login page', function (): void {
    Route::middleware('auth:admin')->get('/test-admin-protected', fn () => 'ok')->name('test.admin.protected');

    $response = $this->get('/test-admin-protected');

    $response->assertRedirect('/admin/login');
});

it('returns a json 401 response for unauthenticated requests', function (): void {
    Route::middleware('auth')->get('/test-json-protected', fn () => 'ok')->name('test.json.protected');

    $response = $this->withHeader('Accept', 'application/json')->get('/test-json-protected');

    $response->assertStatus(401);
});
