package com.eventsphere.auth.service;

import com.eventsphere.auth.dto.*;
import com.eventsphere.auth.entity.User;

public interface AuthService {

    User register(RegisterRequest request);

    TokenResponse login(LoginRequest request, String ipAddress, String userAgent);

    TokenResponse refreshToken(RefreshTokenRequest request);

    void verifyEmail(String token);

    void requestPasswordReset(String email);

    void confirmPasswordReset(PasswordResetRequest request);

    void logout(String userId);
}
