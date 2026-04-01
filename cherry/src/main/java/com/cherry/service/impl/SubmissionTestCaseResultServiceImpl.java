package com.cherry.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.SubmissionTestCaseResult;
import com.cherry.mapper.SubmissionTestCaseResultMapper;
import com.cherry.service.SubmissionTestCaseResultService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubmissionTestCaseResultServiceImpl implements SubmissionTestCaseResultService {

    private final SubmissionTestCaseResultMapper submissionTestCaseResultMapper;

    @Override
    @Transactional
    public SubmissionTestCaseResult create(SubmissionTestCaseResult result) {
        submissionTestCaseResultMapper.insert(result);
        return result;
    }

    @Override
    @Transactional
    public void update(SubmissionTestCaseResult result) {
        submissionTestCaseResultMapper.updateById(result);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        submissionTestCaseResultMapper.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SubmissionTestCaseResult> findById(Long id) {
        return Optional.ofNullable(submissionTestCaseResultMapper.selectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<SubmissionTestCaseResult> page(PageQuery pageQuery) {
        long total = submissionTestCaseResultMapper.count();
        List<SubmissionTestCaseResult> items =
                submissionTestCaseResultMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize());
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }
}
