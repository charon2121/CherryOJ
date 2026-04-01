package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.entity.User;

public interface UserMapper {

    int insert(User user);

    int updateById(User user);

    int deleteById(@Param("id") Long id);

    User selectById(@Param("id") Long id);

    long count();

    List<User> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
