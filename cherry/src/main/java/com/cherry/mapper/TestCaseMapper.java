package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.model.entity.TestCase;

public interface TestCaseMapper {

    int insert(TestCase testCase);

    int updateById(TestCase testCase);

    int deleteById(@Param("id") Long id);

    TestCase selectById(@Param("id") Long id);

    List<TestCase> selectByProblemId(@Param("problemId") Long problemId);

    List<TestCase> selectSamplesByProblemId(@Param("problemId") Long problemId);

    List<TestCase> selectActiveByProblemId(
            @Param("problemId") Long problemId,
            @Param("status") Integer status);

    int deleteByProblemId(@Param("problemId") Long problemId);

    long count();

    List<TestCase> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
