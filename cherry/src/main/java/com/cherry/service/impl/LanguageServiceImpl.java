package com.cherry.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cherry.common.api.PageResult;
import com.cherry.common.page.PageQuery;
import com.cherry.entity.Language;
import com.cherry.mapper.LanguageMapper;
import com.cherry.service.LanguageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LanguageServiceImpl implements LanguageService {

    private final LanguageMapper languageMapper;

    @Override
    @Transactional
    public Language create(Language language) {
        languageMapper.insert(language);
        return language;
    }

    @Override
    @Transactional
    public void update(Language language) {
        languageMapper.updateById(language);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        languageMapper.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Language> findById(Long id) {
        return Optional.ofNullable(languageMapper.selectById(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<Language> page(PageQuery pageQuery) {
        long total = languageMapper.count();
        List<Language> items = languageMapper.selectPage(pageQuery.offset(), pageQuery.getPageSize());
        return new PageResult<>(items, total, pageQuery.getPage(), pageQuery.getPageSize());
    }
}
