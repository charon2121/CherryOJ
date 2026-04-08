package com.cherry.auth;

import java.io.IOException;
import java.util.Arrays;
import java.util.Optional;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.cherry.config.JwtProperties;
import com.cherry.context.UserContext;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthenticationContextFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final JwtProperties jwtProperties;
    private final UserContext userContext;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        userContext.setIsLogin(false);
        userContext.setUserId(null);
        userContext.setCurrentUser(null);

        resolveToken(request)
                .flatMap(jwtService::parseUserId)
                .ifPresent(userId -> {
                    userContext.setUserId(userId);
                    userContext.setIsLogin(true);
                });

        filterChain.doFilter(request, response);
    }

    private Optional<String> resolveToken(HttpServletRequest request) {
        Optional<String> fromCookie = readJwtFromCookie(request);
        if (fromCookie.isPresent()) {
            return fromCookie;
        }
        return readBearerToken(request);
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

    private Optional<String> readBearerToken(HttpServletRequest request) {
        String authorization = request.getHeader("Authorization");
        if (authorization == null || authorization.isBlank()) {
            return Optional.empty();
        }
        String prefix = "Bearer ";
        if (!authorization.startsWith(prefix) || authorization.length() <= prefix.length()) {
            return Optional.empty();
        }
        return Optional.of(authorization.substring(prefix.length()).trim())
                .filter(v -> !v.isBlank());
    }
}
