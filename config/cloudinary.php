<?php

return [

    'cloud_url' => env('CLOUDINARY_URL'),

    'upload_preset' => env('CLOUDINARY_UPLOAD_PRESET'),

    'upload_route' => env(
        'CLOUDINARY_UPLOAD_ROUTE',
        'cloudinary.upload'
    ),

    'upload_action' => env(
        'CLOUDINARY_UPLOAD_ACTION',
        'upload'
    ),

];
