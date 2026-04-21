package com.cherry.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.model.entity.Problem;
import com.cherry.mapper.ProblemMapper;
import com.cherry.service.ProblemService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemMapper problemMapper;

    @Override
    @Transactional
    public Problem create(Problem problem) {
        problemMapper.insert(problem);
        return problem;
    }

    @Override
    @Transactional
    public void update(Problem problem) {
        problemMapper.updateById(problem);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        problemMapper.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Problem> findById(Long id) {
        return Optional.ofNullable(problemMapper.selectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Problem> page(PageQuery pageQuery) {
        long total = problemMapper.count();
        List<Problem> items = problemMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize());
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }
}
