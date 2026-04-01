package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.SubmissionTestCaseResult;

public interface SubmissionTestCaseResultService {

    SubmissionTestCaseResult create(SubmissionTestCaseResult result);

    void update(SubmissionTestCaseResult result);

    void deleteById(Long id);

    Optional<SubmissionTestCaseResult> findById(Long id);

    PageResult<SubmissionTestCaseResult> page(PageQuery pageQuery);
}
