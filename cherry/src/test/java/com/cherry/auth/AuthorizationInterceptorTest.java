package com.cherry.auth;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.lang.reflect.Method;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.method.HandlerMethod;

import com.cherry.common.api.ResultCode;
import com.cherry.common.exception.BusinessException;
import com.cherry.context.UserContext;
import com.cherry.model.dto.auth.UserProfileDto;
import com.cherry.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@ExtendWith(MockitoExtension.class)
class AuthorizationInterceptorTest {

    @Mock
    private UserContext userContext;

    @Mock
    private AuthService authService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    private AuthorizationInterceptor interceptor;

    static class AnnotatedController {

        @RequireLogin
        void loginOnly() {}

        @RequireAdmin
        void adminOnly() {}

        void open() {}
    }

    @BeforeEach
    void setUp() {
        interceptor = new AuthorizationInterceptor(userContext, authService);
    }

    @Test
    void nonHandlerMethod_allows() {
        assertTrue(interceptor.preHandle(request, response, new Object()));
    }

    @Test
    void noAnnotation_allowsWithoutUser() throws Exception {
        Method m = AnnotatedController.class.getDeclaredMethod("open");
        HandlerMethod hm = new HandlerMethod(new AnnotatedController(), m);
        assertDoesNotThrow(() -> interceptor.preHandle(request, response, hm));
    }

    @Test
    void requireLogin_missingUser_throwsUnauthorized() throws Exception {
        Method m = AnnotatedController.class.getDeclaredMethod("loginOnly");
        HandlerMethod hm = new HandlerMethod(new AnnotatedController(), m);
        when(userContext.getIsLogin()).thenReturn(false);
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> interceptor.preHandle(request, response, hm));
        assertEquals(ResultCode.UNAUTHORIZED.getCode(), ex.getCode());
    }

    @Test
    void requireLogin_withUser_allows() throws Exception {
        Method m = AnnotatedController.class.getDeclaredMethod("loginOnly");
        HandlerMethod hm = new HandlerMethod(new AnnotatedController(), m);
        when(userContext.getIsLogin()).thenReturn(true);
        when(userContext.getUserId()).thenReturn(1L);
        assertTrue(interceptor.preHandle(request, response, hm));
    }

    @Test
    void requireAdmin_nonAdmin_throwsForbidden() throws Exception {
        Method m = AnnotatedController.class.getDeclaredMethod("adminOnly");
        HandlerMethod hm = new HandlerMethod(new AnnotatedController(), m);
        when(userContext.getIsLogin()).thenReturn(true);
        when(userContext.getUserId()).thenReturn(1L);
        when(authService.findProfile(1L))
                .thenReturn(
                        java.util.Optional.of(
                                UserProfileDto.builder()
                                        .id(1L)
                                        .username("u")
                                        .email("u@x")
                                        .nickname("n")
                                        .status(1)
                                        .isAdmin(0)
                                        .build()));
        BusinessException ex = assertThrows(
                BusinessException.class,
                () -> interceptor.preHandle(request, response, hm));
        assertEquals(ResultCode.FORBIDDEN.getCode(), ex.getCode());
    }

    @Test
    void requireAdmin_admin_allows() throws Exception {
        Method m = AnnotatedController.class.getDeclaredMethod("adminOnly");
        HandlerMethod hm = new HandlerMethod(new AnnotatedController(), m);
        when(userContext.getIsLogin()).thenReturn(true);
        when(userContext.getUserId()).thenReturn(1L);
        when(authService.findProfile(1L))
                .thenReturn(
                        java.util.Optional.of(
                                UserProfileDto.builder()
                                        .id(1L)
                                        .username("u")
                                        .email("u@x")
                                        .nickname("n")
                                        .status(1)
                                        .isAdmin(1)
                                        .build()));
        assertTrue(interceptor.preHandle(request, response, hm));
    }
}
