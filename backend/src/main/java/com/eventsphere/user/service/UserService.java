package com.eventsphere.user.service;

import com.eventsphere.user.dto.ChangePasswordRequest;
import com.eventsphere.user.dto.UserProfileResponse;
import com.eventsphere.user.dto.UserUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserProfileResponse getCurrentUserProfile(String userId);

    UserProfileResponse updateUserProfile(String userId, UserUpdateRequest request);

    void changePassword(String userId, ChangePasswordRequest request);

    UserProfileResponse getUserById(String id);

    Page<UserProfileResponse> getUsersByTenant(Pageable pageable);
}
