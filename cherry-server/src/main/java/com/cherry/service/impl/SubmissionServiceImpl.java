package com.cherry.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.model.entity.Submission;
import com.cherry.mapper.SubmissionMapper;
import com.cherry.service.SubmissionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionMapper submissionMapper;

    @Override
    @Transactional
    public Submission create(Submission submission) {
        submissionMapper.insert(submission);
        return submission;
    }

    @Override
    @Transactional
    public void update(Submission submission) {
        submissionMapper.updateById(submission);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        submissionMapper.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Submission> findById(Long id) {
        return Optional.ofNullable(submissionMapper.selectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Submission> page(PageQuery pageQuery) {
        long total = submissionMapper.count();
        List<Submission> items = submissionMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize());
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }
}
