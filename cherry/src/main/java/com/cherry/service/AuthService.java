package com.cherry.service;

import java.util.Optional;

import com.cherry.model.dto.auth.LoginRequest;
import com.cherry.model.dto.auth.RegisterRequest;
import com.cherry.model.dto.auth.UserProfileDto;

public interface AuthService {

    UserProfileDto register(RegisterRequest request);

    UserProfileDto login(LoginRequest request);

    Optional<UserProfileDto> findProfile(long userId);
}
