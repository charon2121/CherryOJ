package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.entity.Submission;

public interface SubmissionMapper {

    int insert(Submission submission);

    int updateById(Submission submission);

    int deleteById(@Param("id") Long id);

    Submission selectById(@Param("id") Long id);

    long count();

    List<Submission> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
