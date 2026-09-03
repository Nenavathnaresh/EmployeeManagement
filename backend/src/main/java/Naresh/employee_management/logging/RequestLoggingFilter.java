package Naresh.employee_management.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String requestUri = request.getRequestURI();

        setUsernameInMdc();

        log.info( "Incoming Request - Method: {}, URI: {}", method,requestUri);

        try {
            filterChain.doFilter(request,response);
        }finally {
            long duration = System.currentTimeMillis() - startTime;
            log.info( "Outgoing Response - Method: {}, URI: {}, Status: {}, Duration: {} ms", method,requestUri, response.getStatus(), duration);
        }
    }

    private void setUsernameInMdc(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = "ANONYMOUS";
        if(authentication != null && authentication.isAuthenticated() && !(authentication instanceof AnonymousAuthenticationToken)){
            username = authentication.getName();
        }
        MDC.put("username", username);
    }
}
