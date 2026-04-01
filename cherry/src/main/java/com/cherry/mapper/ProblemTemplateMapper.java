package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.entity.ProblemTemplate;

public interface ProblemTemplateMapper {

    int insert(ProblemTemplate template);

    int updateById(ProblemTemplate template);

    int deleteById(@Param("id") Long id);

    ProblemTemplate selectById(@Param("id") Long id);

    long count();

    List<ProblemTemplate> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
