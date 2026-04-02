package com.cherry.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.model.entity.TestCase;
import com.cherry.mapper.TestCaseMapper;
import com.cherry.service.TestCaseService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestCaseServiceImpl implements TestCaseService {

    private final TestCaseMapper testCaseMapper;

    @Override
    @Transactional
    public TestCase create(TestCase testCase) {
        testCaseMapper.insert(testCase);
        return testCase;
    }

    @Override
    @Transactional
    public void update(TestCase testCase) {
        testCaseMapper.updateById(testCase);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        testCaseMapper.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<TestCase> findById(Long id) {
        return Optional.ofNullable(testCaseMapper.selectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<TestCase> page(PageQuery pageQuery) {
        long total = testCaseMapper.count();
        List<TestCase> items = testCaseMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize());
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }
}
