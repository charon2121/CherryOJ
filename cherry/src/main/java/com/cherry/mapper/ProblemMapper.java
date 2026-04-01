package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.entity.Problem;

public interface ProblemMapper {

    int insert(Problem problem);

    int updateById(Problem problem);

    int deleteById(@Param("id") Long id);

    Problem selectById(@Param("id") Long id);

    long count();

    List<Problem> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
