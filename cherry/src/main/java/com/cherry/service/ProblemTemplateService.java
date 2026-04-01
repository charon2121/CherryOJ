package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.ProblemTemplate;

public interface ProblemTemplateService {

    ProblemTemplate create(ProblemTemplate template);

    void update(ProblemTemplate template);

    void deleteById(Long id);

    Optional<ProblemTemplate> findById(Long id);

    PageResult<ProblemTemplate> page(PageQuery pageQuery);
}
