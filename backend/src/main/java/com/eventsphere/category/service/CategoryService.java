package com.eventsphere.category.service;

import com.eventsphere.category.dto.CategoryRequest;
import com.eventsphere.category.dto.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse getCategoryById(String id);

    Page<CategoryResponse> getCategories(Pageable pageable);

    CategoryResponse updateCategory(String id, CategoryRequest request);

    void deleteCategory(String id);
}
