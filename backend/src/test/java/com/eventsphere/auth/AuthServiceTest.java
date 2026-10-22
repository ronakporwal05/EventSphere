package com.eventsphere.auth;

import com.eventsphere.auth.dto.LoginRequest;
import com.eventsphere.auth.dto.RegisterRequest;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.LoginHistoryRepository;
import com.eventsphere.auth.repository.RefreshTokenRepository;
import com.eventsphere.auth.repository.TenantMembershipRepository;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.auth.service.AuthServiceImpl;
import com.eventsphere.auth.service.EmailVerificationService;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private TenantMembershipRepository tenantMembershipRepository;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private LoginHistoryRepository loginHistoryRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private EmailVerificationService emailVerificationService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .email("test@eventsphere.ai")
                .password("Password123!")
                .firstName("Test")
                .lastName("User")
                .build();
    }

    @Test
    void testRegisterSuccess() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User user = authService.register(registerRequest);

        assertNotNull(user);
        assertEquals("test@eventsphere.ai", user.getEmail());
        verify(emailVerificationService, times(1)).sendVerificationEmail(eq("test@eventsphere.ai"), anyString());
    }

    @Test
    void testRegisterDuplicateEmailThrowsConflict() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(ResourceConflictException.class, () -> authService.register(registerRequest));
    }
}
