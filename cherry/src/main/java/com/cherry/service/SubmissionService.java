package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.Submission;

public interface SubmissionService {

    Submission create(Submission submission);

    void update(Submission submission);

    void deleteById(Long id);

    Optional<Submission> findById(Long id);

    PageResult<Submission> page(PageQuery pageQuery);
}
