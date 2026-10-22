package com.eventsphere.category;

import com.eventsphere.category.dto.CategoryRequest;
import com.eventsphere.category.dto.CategoryResponse;
import com.eventsphere.category.entity.EventCategory;
import com.eventsphere.category.repository.EventCategoryRepository;
import com.eventsphere.category.service.CategoryServiceImpl;
import com.eventsphere.common.tenant.TenantContext;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private EventCategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    @BeforeEach
    void setUp() {
        TenantContext.setTenantId("tenant-cat-1");
    }

    @AfterEach
    void tearDown() {
        TenantContext.clear();
    }

    @Test
    void testCreateCategorySuccess() {
        CategoryRequest request = CategoryRequest.builder()
                .name("Technical Workshop")
                .slug("tech-workshop")
                .description("Hands-on tech workshops")
                .colorCode("#10B981")
                .build();

        when(categoryRepository.existsByTenantIdAndSlugAndDeletedFalse("tenant-cat-1", "tech-workshop")).thenReturn(false);
        when(categoryRepository.save(any(EventCategory.class))).thenAnswer(i -> {
            EventCategory cat = i.getArgument(0);
            cat.setId("cat-123");
            return cat;
        });

        CategoryResponse response = categoryService.createCategory(request);

        assertNotNull(response);
        assertEquals("Technical Workshop", response.getName());
        assertEquals("tech-workshop", response.getSlug());
    }
}
