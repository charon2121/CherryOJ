package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.model.entity.ProblemLanguageLimit;

public interface ProblemLanguageLimitService {

    ProblemLanguageLimit create(ProblemLanguageLimit entity);

    void update(ProblemLanguageLimit entity);

    void deleteById(Long id);

    Optional<ProblemLanguageLimit> findById(Long id);

    PageResult<ProblemLanguageLimit> page(PageQuery pageQuery);
}
