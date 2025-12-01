<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Security headers to protect against common attacks.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Allow CORS for API routes
        if ($request->is('api/*')) {
            $origin = $request->headers->get('Origin');
            $allowedOrigins = config('cors.allowed_origins', []);
            
            // Check if origin is allowed
            $isAllowed = in_array($origin, $allowedOrigins) || 
                        in_array('*', $allowedOrigins) ||
                        empty($allowedOrigins);
            
            if ($isAllowed && $origin) {
                $response->headers->set('Access-Control-Allow-Origin', $origin);
            } elseif (empty($allowedOrigins) || in_array('*', $allowedOrigins)) {
                $response->headers->set('Access-Control-Allow-Origin', '*');
            }
            
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Max-Age', '86400'); // 24 hours
        }

        // Prevent clickjacking (but allow for API if needed)
        if (! $request->is('api/*')) {
            $response->headers->set('X-Frame-Options', 'DENY');
        }

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // Enable XSS filter in browsers
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer policy - don't send referrer to other origins
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions policy - restrict browser features
        $response->headers->set(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=(), payment=()'
        );

        // Content Security Policy (adjust based on your needs)
        // This helps prevent XSS attacks
        if (app()->environment('production')) {
            $response->headers->set(
                'Content-Security-Policy',
                "default-src 'self'; " .
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " .
                "font-src 'self' https://fonts.gstatic.com; " .
                "img-src 'self' data: https:; " .
                "connect-src 'self' " . config('app.url') . '; ' .
                "frame-ancestors 'none';"
            );
        }

        // Strict Transport Security (HTTPS only in production)
        if ($request->secure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains'
            );
        }

        return $response;
    }
}
