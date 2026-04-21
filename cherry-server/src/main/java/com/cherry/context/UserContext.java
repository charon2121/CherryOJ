package com.cherry.context;

import com.cherry.model.entity.User;
import lombok.Data;
import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
@Data
public class UserContext {
    private Long userId;
    private User currentUser;
    private Boolean isLogin;
}
