package com.cherry.service.impl;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.ResultCode;
import com.cherry.common.exception.BusinessException;
import com.cherry.model.dto.auth.LoginRequest;
import com.cherry.model.dto.auth.RegisterRequest;
import com.cherry.model.dto.auth.UserProfileDto;
import com.cherry.mapper.UserMapper;
import com.cherry.model.entity.User;
import com.cherry.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final int MIN_PASSWORD_LEN = 8;

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserProfileDto register(RegisterRequest request) {
        String username = trimToNull(request.getUsername());
        String email = trimToNull(request.getEmail());
        String password = request.getPassword() != null ? request.getPassword() : "";
        String nickname = trimToNull(request.getNickname());

        if (username == null || username.isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("邮箱不能为空");
        }
        if (password.length() < MIN_PASSWORD_LEN) {
            throw new IllegalArgumentException("密码长度至少为 " + MIN_PASSWORD_LEN + " 位");
        }
        if (userMapper.selectByUsername(username) != null) {
            throw new BusinessException(ResultCode.CONFLICT, "用户名已被占用");
        }
        if (userMapper.selectByEmail(email) != null) {
            throw new BusinessException(ResultCode.CONFLICT, "邮箱已被注册");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setNickname(nickname != null ? nickname : username);
        user.setStatus(1);
        user.setIsAdmin(0);
        userMapper.insert(user);
        if (user.getId() == null) {
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "注册失败，请稍后重试");
        }
        return toProfile(userMapper.selectById(user.getId()));
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileDto login(LoginRequest request) {
        String principal = trimToNull(request.getUsername());
        String password = request.getPassword() != null ? request.getPassword() : "";
        if (principal == null || principal.isEmpty()) {
            throw new IllegalArgumentException("用户名不能为空");
        }
        if (password.isEmpty()) {
            throw new IllegalArgumentException("密码不能为空");
        }

        User user = userMapper.selectByUsername(principal);
        if (user == null) {
            user = userMapper.selectByEmail(principal);
        }
        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BusinessException(ResultCode.UNAUTHORIZED, "用户名或密码错误");
        }
        if (user.getStatus() != null && user.getStatus() == 0) {
            throw new BusinessException(ResultCode.FORBIDDEN, "账号已被禁用");
        }
        return toProfile(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserProfileDto> findProfile(long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return Optional.empty();
        }
        return Optional.of(toProfile(user));
    }

    private static String trimToNull(String s) {
        if (s == null) {
            return null;
        }
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private static UserProfileDto toProfile(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .status(user.getStatus())
                .isAdmin(user.getIsAdmin())
                .build();
    }
}
