package com.eventsphere.auth.service;

import com.eventsphere.auth.dto.*;
import com.eventsphere.auth.entity.*;
import com.eventsphere.auth.repository.*;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.exception.UnauthorizedException;
import com.eventsphere.common.security.JwtTokenProvider;
import com.eventsphere.common.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TenantMembershipRepository tenantMembershipRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailVerificationService emailVerificationService;

    @Value("${eventsphere.security.max-failed-attempts:5}")
    private int maxFailedAttempts;

    @Value("${eventsphere.security.lock-duration-ms:1800000}")
    private long lockDurationMs;

    @Value("${eventsphere.jwt.expiration-ms:900000}")
    private long accessTokenExpirationMs;

    @Override
    @Transactional
    public User register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceConflictException("User with email '" + request.getEmail() + "' already exists");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .status("ACTIVE")
                .emailVerified(false)
                .verificationToken(verificationToken)
                .failedLoginAttempts(0)
                .build();

        User savedUser = userRepository.save(user);

        emailVerificationService.sendVerificationEmail(savedUser.getEmail(), verificationToken);

        return savedUser;
    }

    @Override
    @Transactional
    public TokenResponse login(LoginRequest request, String ipAddress, String userAgent) {
        log.info("Attempting login for email: {}", request.getEmail());

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().toLowerCase().trim());

        if (userOpt.isEmpty()) {
            recordLoginAttempt(null, request.getEmail(), ipAddress, userAgent, false, "User not found");
            throw new BadCredentialsException("Invalid email or password");
        }

        User user = userOpt.get();

        // Check if account is locked
        if (user.getLockExpiresAt() != null && user.getLockExpiresAt().isAfter(Instant.now())) {
            recordLoginAttempt(user.getId(), user.getEmail(), ipAddress, userAgent, false, "Account locked");
            throw new UnauthorizedException("Account is locked due to multiple failed login attempts. Try again later.");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            int newFailedCount = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(newFailedCount);
            if (newFailedCount >= maxFailedAttempts) {
                user.setLockExpiresAt(Instant.now().plusMillis(lockDurationMs));
                log.warn("Account locked for user: {}", user.getEmail());
            }
            userRepository.save(user);
            recordLoginAttempt(user.getId(), user.getEmail(), ipAddress, userAgent, false, "Invalid password");
            throw new BadCredentialsException("Invalid email or password");
        }

        // Reset failed login attempts on successful login
        user.setFailedLoginAttempts(0);
        user.setLockExpiresAt(null);
        userRepository.save(user);

        // Fetch user memberships and roles
        List<TenantMembership> memberships = tenantMembershipRepository.findByUserId(user.getId());
        List<String> roles = memberships.stream()
                .map(m -> m.getRole().getName())
                .distinct()
                .collect(Collectors.toList());

        if (roles.isEmpty()) {
            roles = List.of("ATTENDEE");
        }

        String targetTenantId = request.getTenantId();
        if (targetTenantId == null && !memberships.isEmpty()) {
            targetTenantId = memberships.get(0).getTenantId();
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles, targetTenantId);
        String refreshTokenStr = jwtTokenProvider.generateRefreshToken(user.getId());

        // Save refresh token hash
        saveRefreshToken(user, refreshTokenStr, userAgent);

        recordLoginAttempt(user.getId(), user.getEmail(), ipAddress, userAgent, true, null);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .expiresInMs(accessTokenExpirationMs)
                .userId(user.getId())
                .email(user.getEmail())
                .roles(roles)
                .tenantId(targetTenantId)
                .build();
    }

    @Override
    @Transactional
    public TokenResponse refreshToken(RefreshTokenRequest request) {
        String tokenStr = request.getRefreshToken();
        if (!jwtTokenProvider.validateToken(tokenStr)) {
            throw new UnauthorizedException("Invalid or expired refresh token");
        }

        String userId = jwtTokenProvider.getUserIdFromToken(tokenStr);
        String tokenHash = hashToken(tokenStr);

        RefreshToken refreshTokenEntity = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Refresh token not found or revoked"));

        if (refreshTokenEntity.isRevoked() || refreshTokenEntity.getExpiresAt().isBefore(Instant.now())) {
            throw new UnauthorizedException("Refresh token has expired or been revoked");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Refresh token rotation: revoke current, issue new
        refreshTokenEntity.setRevoked(true);
        String newRefreshTokenStr = jwtTokenProvider.generateRefreshToken(user.getId());
        refreshTokenEntity.setReplacedBy(hashToken(newRefreshTokenStr));
        refreshTokenRepository.save(refreshTokenEntity);

        List<TenantMembership> memberships = tenantMembershipRepository.findByUserId(user.getId());
        List<String> roles = memberships.stream().map(m -> m.getRole().getName()).distinct().collect(Collectors.toList());
        if (roles.isEmpty()) roles = List.of("ATTENDEE");

        String tenantId = TenantContext.getTenantId();
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail(), roles, tenantId);

        saveRefreshToken(user, newRefreshTokenStr, refreshTokenEntity.getDeviceInfo());

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshTokenStr)
                .tokenType("Bearer")
                .expiresInMs(accessTokenExpirationMs)
                .userId(user.getId())
                .email(user.getEmail())
                .roles(roles)
                .tenantId(tenantId)
                .build();
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email verification token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        log.info("Email verified successfully for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void requestPasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email.toLowerCase().trim());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String otp = String.format("%06d", new Random().nextInt(999999));
            user.setVerificationToken("RESET_" + otp);
            userRepository.save(user);
            emailVerificationService.sendPasswordResetEmail(user.getEmail(), otp);
        }
    }

    @Override
    @Transactional
    public void confirmPasswordReset(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getVerificationToken() == null || !user.getVerificationToken().equals("RESET_" + request.getOtp())) {
            throw new UnauthorizedException("Invalid password reset OTP");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setVerificationToken(null);
        userRepository.save(user);
        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void logout(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
        log.info("User logged out and refresh tokens revoked for userId: {}", userId);
    }

    private void saveRefreshToken(User user, String tokenStr, String deviceInfo) {
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .tokenHash(hashToken(tokenStr))
                .deviceInfo(deviceInfo)
                .expiresAt(Instant.now().plusMillis(604800000)) // 7 days
                .revoked(false)
                .build();
        refreshTokenRepository.save(token);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }

    private void recordLoginAttempt(String userId, String email, String ip, String userAgent, boolean success, String failureReason) {
        LoginHistory history = LoginHistory.builder()
                .userId(userId)
                .emailAttempted(email)
                .ipAddress(ip != null ? ip : "127.0.0.1")
                .userAgent(userAgent)
                .success(success)
                .failureReason(failureReason)
                .build();
        loginHistoryRepository.save(history);
    }
}
