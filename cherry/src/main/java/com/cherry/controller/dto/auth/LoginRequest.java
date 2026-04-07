package com.cherry.controller.dto.auth;

import lombok.Data;

@Data
public class LoginRequest {

    /** 用户名或邮箱 */
    private String username;
    private String password;
}
