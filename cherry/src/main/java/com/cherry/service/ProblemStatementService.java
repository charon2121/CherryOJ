package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.model.entity.ProblemStatement;

public interface ProblemStatementService {

    void create(ProblemStatement statement);

    void update(ProblemStatement statement);

    void deleteByProblemId(Long problemId);

    Optional<ProblemStatement> findByProblemId(Long problemId);

    PageResult<ProblemStatement> page(PageQuery pageQuery);
}
