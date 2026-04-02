package com.cherry.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.cherry.model.entity.Language;

public interface LanguageMapper {

    int insert(Language language);

    int updateById(Language language);

    int deleteById(@Param("id") Long id);

    Language selectById(@Param("id") Long id);

    long count();

    List<Language> selectPage(@Param("offset") long offset, @Param("limit") int limit);
}
