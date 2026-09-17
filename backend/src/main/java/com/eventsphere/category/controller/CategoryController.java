package com.eventsphere.category.controller;

import com.eventsphere.category.dto.CategoryRequest;
import com.eventsphere.category.dto.CategoryResponse;
import com.eventsphere.category.service.CategoryService;
import com.eventsphere.common.audit.Auditable;
import com.eventsphere.common.dto.ApiResponse;
import com.eventsphere.common.dto.PagedResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "CREATE_CATEGORY", entityType = "CATEGORY")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable("id") String id) {
        CategoryResponse response = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<PagedResponse<CategoryResponse>> getCategories(Pageable pageable) {
        Page<CategoryResponse> page = categoryService.getCategories(pageable);
        return ResponseEntity.ok(PagedResponse.fromPage(page, "Categories retrieved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "UPDATE_CATEGORY", entityType = "CATEGORY")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(@PathVariable("id") String id, @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZATION_ADMIN') or hasRole('EVENT_MANAGER')")
    @Auditable(action = "DELETE_CATEGORY", entityType = "CATEGORY")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable("id") String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}
