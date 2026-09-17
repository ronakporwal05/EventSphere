package com.eventsphere.category.service;

import com.eventsphere.category.dto.CategoryRequest;
import com.eventsphere.category.dto.CategoryResponse;
import com.eventsphere.category.entity.EventCategory;
import com.eventsphere.category.repository.EventCategoryRepository;
import com.eventsphere.common.exception.ResourceConflictException;
import com.eventsphere.common.exception.ResourceNotFoundException;
import com.eventsphere.common.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final EventCategoryRepository categoryRepository;

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        String tenantId = TenantContext.getTenantId();
        log.info("Creating event category '{}' for tenant '{}'", request.getName(), tenantId);

        if (categoryRepository.existsByTenantIdAndSlugAndDeletedFalse(tenantId, request.getSlug())) {
            throw new ResourceConflictException("Category slug '" + request.getSlug() + "' already exists");
        }

        EventCategory category = EventCategory.builder()
                .tenantId(tenantId)
                .name(request.getName())
                .slug(request.getSlug().toLowerCase().trim())
                .description(request.getDescription())
                .colorCode(request.getColorCode() != null ? request.getColorCode() : "#4F46E5")
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        EventCategory saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(String id) {
        String tenantId = TenantContext.getTenantId();
        EventCategory category = categoryRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToResponse(category);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> getCategories(Pageable pageable) {
        String tenantId = TenantContext.getTenantId();
        return categoryRepository.findByTenantIdAndDeletedFalse(tenantId, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        String tenantId = TenantContext.getTenantId();
        EventCategory category = categoryRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        if (request.getColorCode() != null) category.setColorCode(request.getColorCode());
        if (request.getActive() != null) category.setActive(request.getActive());

        EventCategory saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteCategory(String id) {
        String tenantId = TenantContext.getTenantId();
        EventCategory category = categoryRepository.findByIdAndTenantIdAndDeletedFalse(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        category.setDeleted(true);
        categoryRepository.save(category);
        log.info("Soft-deleted category with ID: {}", id);
    }

    private CategoryResponse mapToResponse(EventCategory cat) {
        return CategoryResponse.builder()
                .id(cat.getId())
                .name(cat.getName())
                .slug(cat.getSlug())
                .description(cat.getDescription())
                .colorCode(cat.getColorCode())
                .active(cat.isActive())
                .createdAt(cat.getCreatedAt())
                .build();
    }
}
