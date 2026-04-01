package com.cherry.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.ProblemLanguageLimit;
import com.cherry.mapper.ProblemLanguageLimitMapper;
import com.cherry.service.ProblemLanguageLimitService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProblemLanguageLimitServiceImpl implements ProblemLanguageLimitService {

    private final ProblemLanguageLimitMapper problemLanguageLimitMapper;

    @Override
    @Transactional
    public ProblemLanguageLimit create(ProblemLanguageLimit entity) {
        problemLanguageLimitMapper.insert(entity);
        return entity;
    }

    @Override
    @Transactional
    public void update(ProblemLanguageLimit entity) {
        problemLanguageLimitMapper.updateById(entity);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        problemLanguageLimitMapper.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ProblemLanguageLimit> findById(Long id) {
        return Optional.ofNullable(problemLanguageLimitMapper.selectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<ProblemLanguageLimit> page(PageQuery pageQuery) {
        long total = problemLanguageLimitMapper.count();
        List<ProblemLanguageLimit> items =
                problemLanguageLimitMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize());
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }
}
