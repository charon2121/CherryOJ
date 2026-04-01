package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.User;

public interface UserService {

    User create(User user);

    void update(User user);

    void deleteById(Long id);

    Optional<User> findById(Long id);

    PageResult<User> page(PageQuery pageQuery);
}
