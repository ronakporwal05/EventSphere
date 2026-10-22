package com.eventsphere.invitation;

import com.eventsphere.auth.entity.Role;
import com.eventsphere.auth.entity.User;
import com.eventsphere.auth.repository.RoleRepository;
import com.eventsphere.auth.repository.TenantMembershipRepository;
import com.eventsphere.auth.repository.UserRepository;
import com.eventsphere.auth.service.EmailVerificationService;
import com.eventsphere.common.tenant.TenantContext;
import com.eventsphere.invitation.dto.InvitationResponse;
import com.eventsphere.invitation.dto.InviteUserRequest;
import com.eventsphere.invitation.entity.Invitation;
import com.eventsphere.invitation.repository.InvitationRepository;
import com.eventsphere.invitation.service.InvitationServiceImpl;
import org.junit.jupiter.api.AfterEach;
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
class InvitationServiceTest {

    @Mock
    private InvitationRepository invitationRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private TenantMembershipRepository membershipRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private EmailVerificationService emailVerificationService;

    @InjectMocks
    private InvitationServiceImpl invitationService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-inv-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testSendInvitationSuccess() {
        User inviter = User.builder().id("user-1").email("admin@tenant.com").build();
        Role role = Role.builder().id("role-1").name("EVENT_MANAGER").build();

        when(userRepository.findById("user-1")).thenReturn(Optional.of(inviter));
        when(roleRepository.findById("role-1")).thenReturn(Optional.of(role));
        when(invitationRepository.save(any(Invitation.class))).thenAnswer(i -> {
            Invitation inv = i.getArgument(0);
            inv.setId("inv-123");
            return inv;
        });

        InviteUserRequest request = InviteUserRequest.builder()
                .email("invitee@eventsphere.ai")
                .roleId("role-1")
                .department("Engineering")
                .build();

        InvitationResponse response = invitationService.sendInvitation("user-1", request);

        assertNotNull(response);
        assertEquals("invitee@eventsphere.ai", response.getEmail());
        assertEquals("EVENT_MANAGER", response.getRoleName());
        verify(emailVerificationService, times(1)).sendVerificationEmail(eq("invitee@eventsphere.ai"), anyString());
    }
}
