package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.model.entity.ProblemStatement;

public interface ProblemStatementMapper {

    int insert(ProblemStatement statement);

    int updateByProblemId(ProblemStatement statement);

    int deleteByProblemId(@Param("problemId") Long problemId);

    ProblemStatement selectByProblemId(@Param("problemId") Long problemId);

    long count();

    List<ProblemStatement> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
