<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="icon" href="/slotem_favicon.ico" sizes="any">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-light.png" media="(prefers-color-scheme: light)">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-dark.png" media="(prefers-color-scheme: dark)">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-light.png">
    {{-- <link rel="icon" href="/slotem_favicon_light.svg" type="image/svg+xml"> --}}
    {{-- <link rel="apple-touch-icon" href="/apple-touch-icon.png"> --}}

    <link rel="manifest" href="/build/manifest.webmanifest">
    <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#111318" media="(prefers-color-scheme: dark)">
    <meta name="theme-color" content="#7C3AED">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        <title>{{ config('app.name', 'Laravel') }}</title>
    </x-inertia::head>
    @routes
</head>

<body class="font-sans antialiased">
    <x-inertia::app />
</body>

</html>
