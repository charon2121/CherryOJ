package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.model.entity.ProblemLanguageLimit;

public interface ProblemLanguageLimitMapper {

    int insert(ProblemLanguageLimit entity);

    int updateById(ProblemLanguageLimit limit);

    int deleteById(@Param("id") Long id);

    ProblemLanguageLimit selectById(@Param("id") Long id);

    List<ProblemLanguageLimit> selectByProblemId(@Param("problemId") Long problemId);

    long count();

    List<ProblemLanguageLimit> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
