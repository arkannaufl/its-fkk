<?php

use App\Models\ActiveSession;
use App\Models\PasswordResetOTP;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    Mail::fake();
    Storage::fake('public');
});

test('user can login with valid email and password', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'is_active' => true,
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => ['id', 'name', 'email', 'role'],
                'token',
                'token_type',
                'expires_in',
            ],
        ])
        ->assertJson(['success' => true]);

    expect($response->json('data.user.email'))->toBe('test@example.com');
    expect($response->json('data.token'))->not->toBeNull();
});

test('user can login with username instead of email', function () {
    $user = User::factory()->create([
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'is_active' => true,
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'testuser',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);
});

test('user cannot login with invalid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
        ->assertJson(['success' => false]);
});

test('user cannot login if account is inactive', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'is_active' => false,
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(403)
        ->assertJson(['success' => false]);
});

test('login is rate limited after 5 failed attempts', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Attempt 5 failed logins
    for ($i = 0; $i < 5; $i++) {
        $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);
    }

    // 6th attempt should be rate limited
    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(422);
});

test('user can get current authenticated user', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->getJson('/api/auth/me');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'data' => ['id', 'name', 'email', 'role'],
        ])
        ->assertJson(['success' => true]);
});

test('user can refresh token', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/auth/refresh');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'data' => ['token', 'token_type', 'expires_in'],
        ])
        ->assertJson(['success' => true]);
});

test('user can logout', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/auth/logout');

    $response->assertStatus(200)
        ->assertJson(['success' => true]);
});

test('user can update profile', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);
    Sanctum::actingAs($user);

    $response = $this->putJson('/api/auth/profile', [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'phone' => '+62 812-3456-7890',
    ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    $user->refresh();
    expect($user->name)->toBe('New Name');
    expect($user->email)->toBe('new@example.com');
    expect($user->phone)->toBe('+62 812-3456-7890');
});

test('user can change password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('oldpassword123'),
    ]);
    Sanctum::actingAs($user);

    $response = $this->putJson('/api/auth/change-password', [
        'current_password' => 'oldpassword123',
        'new_password' => 'newpassword123',
        'new_password_confirmation' => 'newpassword123',
    ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    $user->refresh();
    expect(Hash::check('newpassword123', $user->password))->toBeTrue();
});

test('user cannot change password with wrong current password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('oldpassword123'),
    ]);
    Sanctum::actingAs($user);

    $response = $this->putJson('/api/auth/change-password', [
        'current_password' => 'wrongpassword',
        'new_password' => 'newpassword123',
        'new_password_confirmation' => 'newpassword123',
    ]);

    $response->assertStatus(422)
        ->assertJson(['success' => false]);
});

test('user can upload avatar', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $file = \Illuminate\Http\UploadedFile::fake()->image('avatar.jpg', 500, 500);

    $response = $this->postJson('/api/auth/avatar', [
        'avatar' => $file,
    ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true])
        ->assertJsonStructure(['data' => ['avatar']]);

    $user->refresh();
    expect($user->avatar)->not->toBeNull();
    Storage::disk('public')->assertExists($user->avatar);
});

test('user can delete avatar', function () {
    $user = User::factory()->create([
        'avatar' => 'avatars/test.jpg',
    ]);
    Storage::disk('public')->put('avatars/test.jpg', 'fake content');
    Sanctum::actingAs($user);

    $response = $this->deleteJson('/api/auth/avatar');

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    $user->refresh();
    expect($user->avatar)->toBeNull();
});

test('user can request password reset OTP', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'is_active' => true,
    ]);

    $response = $this->postJson('/api/auth/password/reset/request', [
        'email' => 'test@example.com',
    ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    Mail::assertSent(\App\Mail\PasswordResetOTP::class);
    expect(PasswordResetOTP::where('email', 'test@example.com')->exists())->toBeTrue();
});

test('user can verify password reset OTP', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
    ]);

    $otp = PasswordResetOTP::create([
        'email' => 'test@example.com',
        'otp' => '123456',
        'expires_at' => now()->addMinutes(10),
        'is_verified' => false,
    ]);

    $response = $this->postJson('/api/auth/password/reset/verify', [
        'email' => 'test@example.com',
        'otp' => '123456',
    ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    $otp->refresh();
    expect($otp->is_verified)->toBeTrue();
});

test('user can reset password after OTP verification', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('oldpassword123'),
    ]);

    $otp = PasswordResetOTP::create([
        'email' => 'test@example.com',
        'otp' => '123456',
        'expires_at' => now()->addMinutes(10),
        'is_verified' => true,
    ]);

    $response = $this->postJson('/api/auth/password/reset', [
        'email' => 'test@example.com',
        'otp' => '123456',
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    $user->refresh();
    expect(Hash::check('newpassword123', $user->password))->toBeTrue();
    expect(PasswordResetOTP::where('email', 'test@example.com')->count())->toBe(0);
});

test('unauthenticated user cannot access protected routes', function () {
    $response = $this->getJson('/api/auth/me');

    $response->assertStatus(401);
});

test('user cannot login if already logged in on another device without force logout', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Create existing session
    ActiveSession::create([
        'user_id' => $user->id,
        'token_id' => 'existing-token',
        'device_name' => 'Existing Device',
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Test Agent',
        'last_activity' => now(),
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(409)
        ->assertJson(['success' => false, 'requires_force_logout' => true]);
});

test('user can force logout existing session and login', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Create existing session
    ActiveSession::create([
        'user_id' => $user->id,
        'token_id' => 'existing-token',
        'device_name' => 'Existing Device',
        'ip_address' => '127.0.0.1',
        'user_agent' => 'Test Agent',
        'last_activity' => now(),
    ]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
        'force_logout' => true,
    ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    expect(ActiveSession::where('user_id', $user->id)->count())->toBe(1);
});
