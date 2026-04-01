package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.Language;

public interface LanguageService {

    Language create(Language language);

    void update(Language language);

    void deleteById(Long id);

    Optional<Language> findById(Long id);

    PageResult<Language> page(PageQuery pageQuery);
}
