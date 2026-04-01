package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.entity.SubmissionTestCaseResult;

public interface SubmissionTestCaseResultMapper {

    int insert(SubmissionTestCaseResult result);

    int updateById(SubmissionTestCaseResult result);

    int deleteById(@Param("id") Long id);

    SubmissionTestCaseResult selectById(@Param("id") Long id);

    long count();

    List<SubmissionTestCaseResult> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
