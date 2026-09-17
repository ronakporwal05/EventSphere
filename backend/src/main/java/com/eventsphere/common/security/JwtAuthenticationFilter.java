package com.eventsphere.common.security;

import com.eventsphere.common.tenant.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Order(1)
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = parseBearerToken(request);

        if (StringUtils.hasText(token) && tokenProvider.validateToken(token)) {
            String userId = tokenProvider.getUserIdFromToken(token);
            String tenantId = tokenProvider.getTenantIdFromToken(token);
            List<String> roles = tokenProvider.getRolesFromToken(token);

            if (tenantId != null && !tenantId.isBlank()) {
                TenantContext.setTenantId(tenantId);
            }

            List<SimpleGrantedAuthority> authorities = roles != null ?
                    roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).collect(Collectors.toList()) :
                    List.of();

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userId, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.trace("Authenticated user ID: {} with roles: {}", userId, roles);
        }

        filterChain.doFilter(request, response);
    }

    private String parseBearerToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
