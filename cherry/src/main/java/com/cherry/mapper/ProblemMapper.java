package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.model.entity.Problem;

public interface ProblemMapper {

    int insert(Problem problem);

    int updateById(Problem problem);

    int deleteById(@Param("id") Long id);

    Problem selectById(@Param("id") Long id);

    Problem selectPublishedById(@Param("id") Long id, @Param("status") Integer status);

    long count();

    long countPublished(@Param("status") Integer status);

    List<Problem> selectPage(@Param("offset") long offset, @Param("limit") int limit);

    List<Problem> selectPublishedPage(
            @Param("status") Integer status,
            @Param("offset") long offset,
            @Param("limit") int limit);
}
