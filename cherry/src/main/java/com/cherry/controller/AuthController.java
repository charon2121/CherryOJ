package com.cherry.controller;

import java.util.Arrays;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cherry.auth.AuthCookieSupport;
import com.cherry.auth.JwtService;
import com.cherry.common.api.ApiResponse;
import com.cherry.common.api.ResultCode;
import com.cherry.common.exception.BusinessException;
import com.cherry.config.JwtProperties;
import com.cherry.model.dto.auth.ForgotPasswordRequest;
import com.cherry.model.dto.auth.LoginRequest;
import com.cherry.model.dto.auth.RegisterRequest;
import com.cherry.model.dto.auth.UserProfileDto;
import com.cherry.service.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final AuthCookieSupport authCookieSupport;
    private final JwtProperties jwtProperties;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserProfileDto>> register(@RequestBody RegisterRequest body) {
        UserProfileDto profile = authService.register(body);
        String jwt = jwtService.createToken(profile.getId());
        return ResponseEntity.ok()
                .headers(h -> authCookieSupport.appendSetCookie(h, jwt))
                .body(ApiResponse.ok(profile));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserProfileDto>> login(@RequestBody LoginRequest body) {
        UserProfileDto profile = authService.login(body);
        String jwt = jwtService.createToken(profile.getId());
        return ResponseEntity.ok()
                .headers(h -> authCookieSupport.appendSetCookie(h, jwt))
                .body(ApiResponse.ok(profile));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileDto>> me(HttpServletRequest request) {
        String token = readJwtFromCookie(request).orElse("");
        long userId = jwtService.parseUserId(token)
                .orElseThrow(() -> new BusinessException(ResultCode.UNAUTHORIZED));
        UserProfileDto profile = authService.findProfile(userId)
                .orElseThrow(() -> new BusinessException(ResultCode.UNAUTHORIZED));
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    /**
     * 占位：后续可接入邮件服务发送重置链接。
     */
    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@RequestBody ForgotPasswordRequest body) {
        if (body.getEmail() == null || body.getEmail().isBlank()) {
            throw new IllegalArgumentException("邮箱不能为空");
        }
        return ApiResponse.ok();
    }

    private Optional<String> readJwtFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return Optional.empty();
        }
        return Arrays.stream(cookies)
                .filter(c -> jwtProperties.getCookieName().equals(c.getName()))
                .map(Cookie::getValue)
                .filter(v -> v != null && !v.isBlank())
                .findFirst();
    }
}
