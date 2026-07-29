<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Auth\Factory as Auth;
use Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class Authenticate implements AuthenticatesRequests
{
    /**
     * The authentication factory instance.
     */
    protected Auth $auth;

    /**
     * Create a new middleware instance.
     */
    public function __construct(Auth $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  array<int, string|null>  $guards
     */
    public function handle(Request $request, Closure $next, ...$guards): mixed
    {
        $this->authenticate($request, $guards);

        return $next($request);
    }

    /**
     * Determine if the user is logged in to any of the given guards.
     *
     * @param  array<int, string|null>  $guards
     */
    protected function authenticate(Request $request, array $guards): void
    {
        if (empty($guards)) {
            $guards = [null];
        }

        foreach ($guards as $guard) {
            if ($this->auth->guard($guard)->check()) {
                $this->auth->shouldUse($guard);

                return;
            }
        }

        $this->unauthenticated($request, $guards);
    }

    /**
     * Handle an unauthenticated user.
     *
     * @param  array<int, string|null>  $guards
     *
     * @throws AuthenticationException
     */
    protected function unauthenticated(Request $request, array $guards): void
    {
        throw new AuthenticationException(
            'Unauthenticated.',
            $guards,
            $request->expectsJson() ? null : $this->redirectTo($request, $guards),
        );
    }

    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request, array $guards): ?string
    {
        if ($request->expectsJson()) {
            return null;
        }

        $guard = $guards[0] ?? null;

        if ($guard === 'admin') {
            return route('admin.login');
        }

        $routeName = $request->route()?->getName();

        if ($routeName && Str::startsWith($routeName, 'admin.')) {
            return route('admin.login');
        }

        return route('user.login');
    }
}
