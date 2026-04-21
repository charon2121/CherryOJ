package com.cherry.auth;

import java.lang.annotation.Annotation;

import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import com.cherry.common.api.ResultCode;
import com.cherry.common.exception.BusinessException;
import com.cherry.context.UserContext;
import com.cherry.model.dto.auth.UserProfileDto;
import com.cherry.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthorizationInterceptor implements HandlerInterceptor {

    private final UserContext userContext;
    private final AuthService authService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }
        boolean requireAdmin = hasAnnotation(handlerMethod, RequireAdmin.class);
        boolean requireLogin = requireAdmin || hasAnnotation(handlerMethod, RequireLogin.class);
        if (!requireLogin) {
            return true;
        }
        Long userId = userContext.getUserId();
        if (!Boolean.TRUE.equals(userContext.getIsLogin()) || userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        if (!requireAdmin) {
            return true;
        }
        UserProfileDto profile = authService.findProfile(userId)
                .orElseThrow(() -> new BusinessException(ResultCode.UNAUTHORIZED));
        Integer isAdmin = profile.getIsAdmin();
        if (isAdmin == null || isAdmin == 0) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }
        return true;
    }

    private static boolean hasAnnotation(
            HandlerMethod handlerMethod,
            Class<? extends Annotation> annotationType) {
        return AnnotatedElementUtils.hasAnnotation(handlerMethod.getMethod(), annotationType)
                || AnnotatedElementUtils.hasAnnotation(handlerMethod.getBeanType(), annotationType);
    }
}
