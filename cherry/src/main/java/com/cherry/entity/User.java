package com.cherry.entity;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class User {

    private Long id;
    private String username;
    private String email;
    private String passwordHash;
    private String nickname;
    private Integer status;
    private Integer isAdmin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
