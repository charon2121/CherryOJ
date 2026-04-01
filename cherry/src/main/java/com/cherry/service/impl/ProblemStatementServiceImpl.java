package com.cherry.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.ProblemStatement;
import com.cherry.mapper.ProblemStatementMapper;
import com.cherry.service.ProblemStatementService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemStatementServiceImpl implements ProblemStatementService {

    private final ProblemStatementMapper problemStatementMapper;

    @Override
    @Transactional
    public void create(ProblemStatement statement) {
        problemStatementMapper.insert(statement);
    }

    @Override
    @Transactional
    public void update(ProblemStatement statement) {
        problemStatementMapper.updateByProblemId(statement);
    }

    @Override
    @Transactional
    public void deleteByProblemId(Long problemId) {
        problemStatementMapper.deleteByProblemId(problemId);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProblemStatement> findByProblemId(Long problemId) {
        return Optional.ofNullable(problemStatementMapper.selectByProblemId(problemId));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<ProblemStatement> page(PageQuery pageQuery) {
        long total = problemStatementMapper.count();
        List<ProblemStatement> items =
                problemStatementMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize());
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }
}
