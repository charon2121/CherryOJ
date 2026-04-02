package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.model.entity.TestCase;

public interface TestCaseMapper {

    int insert(TestCase testCase);

    int updateById(TestCase testCase);

    int deleteById(@Param("id") Long id);

    TestCase selectById(@Param("id") Long id);

    long count();

    List<TestCase> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
