package com.cherry.auth;

import java.time.Duration;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import com.cherry.config.JwtProperties;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthCookieSupport {

    private final JwtProperties jwtProperties;

    public void appendSetCookie(HttpHeaders headers, String jwtValue) {
        ResponseCookie cookie = ResponseCookie.from(jwtProperties.getCookieName(), jwtValue)
                .path(jwtProperties.getCookiePath())
                .maxAge(Duration.ofMillis(jwtProperties.getExpirationMs()))
                .httpOnly(true)
                .secure(jwtProperties.isCookieSecure())
                .sameSite("Lax")
                .build();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public void appendClearCookie(HttpHeaders headers) {
        ResponseCookie cookie = ResponseCookie.from(jwtProperties.getCookieName(), "")
                .path(jwtProperties.getCookiePath())
                .maxAge(0)
                .httpOnly(true)
                .secure(jwtProperties.isCookieSecure())
                .sameSite("Lax")
                .build();
        headers.add(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
