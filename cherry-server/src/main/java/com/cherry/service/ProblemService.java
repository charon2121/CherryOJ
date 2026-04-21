package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.model.entity.Problem;

public interface ProblemService {

    Problem create(Problem problem);

    void update(Problem problem);

    void deleteById(Long id);

    Optional<Problem> findById(Long id);

    PageResult<Problem> page(PageQuery pageQuery);
}
