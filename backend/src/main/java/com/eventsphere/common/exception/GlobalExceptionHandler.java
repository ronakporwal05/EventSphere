package com.eventsphere.common.exception;

import com.eventsphere.common.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        ErrorResponse response = ErrorResponse.of(
                "RESOURCE_NOT_FOUND",
                ex.getMessage(),
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(ResourceConflictException.class)
    public ResponseEntity<ErrorResponse> handleResourceConflict(ResourceConflictException ex, HttpServletRequest request) {
        log.warn("Resource conflict: {}", ex.getMessage());
        ErrorResponse response = ErrorResponse.of(
                "RESOURCE_CONFLICT",
                ex.getMessage(),
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(TenantAccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleTenantAccessDenied(TenantAccessDeniedException ex, HttpServletRequest request) {
        log.warn("Tenant access denied: {}", ex.getMessage());
        ErrorResponse response = ErrorResponse.of(
                "TENANT_ACCESS_DENIED",
                ex.getMessage(),
                List.of("Access denied for current tenant context"),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex, HttpServletRequest request) {
        log.warn("Unauthorized request: {}", ex.getMessage());
        ErrorResponse response = ErrorResponse.of(
                "UNAUTHORIZED",
                ex.getMessage(),
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        log.warn("Invalid credentials attempt on URI: {}", request.getRequestURI());
        ErrorResponse response = ErrorResponse.of(
                "INVALID_CREDENTIALS",
                "Invalid email or password",
                List.of("Authentication failed"),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        log.warn("Access denied on URI: {}", request.getRequestURI());
        ErrorResponse response = ErrorResponse.of(
                "ACCESS_DENIED",
                "You do not have permission to access this resource",
                List.of(ex.getMessage()),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.toList());

        log.warn("Validation failed for URI: {}", request.getRequestURI());
        ErrorResponse response = ErrorResponse.of(
                "VALIDATION_FAILED",
                "Validation constraint violations occurred",
                details,
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception processing request: {}", request.getRequestURI(), ex);
        ErrorResponse response = ErrorResponse.of(
                "INTERNAL_SERVER_ERROR",
                "An unexpected internal error occurred",
                List.of(ex.getMessage() != null ? ex.getMessage() : "Unknown error"),
                request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
