package com.cherry.model.dto.auth;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserProfileDto {

    Long id;
    String username;
    String email;
    String nickname;
    Integer status;
    Integer isAdmin;
}
