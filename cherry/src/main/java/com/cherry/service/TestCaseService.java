package com.cherry.service;

import java.util.Optional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.TestCase;

public interface TestCaseService {

    TestCase create(TestCase testCase);

    void update(TestCase testCase);

    void deleteById(Long id);

    Optional<TestCase> findById(Long id);

    PageResult<TestCase> page(PageQuery pageQuery);
}
