package Naresh.employee_management.exception;

import Naresh.employee_management.common.ApiResponse;
import Naresh.employee_management.common.ApiResponseUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(
            AccessDeniedException ex) {

        return ApiResponseUtil.error(
                HttpStatus.FORBIDDEN,
                "Access denied",
                List.of("You do not have permission to perform this action")
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(BadCredentialsException ex) {

        return ApiResponseUtil.error(
                HttpStatus.UNAUTHORIZED,
                "Invalid email or password",
                List.of("Invalid email or password")
        );
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidCredentials(InvalidCredentialsException ex){

        return ApiResponseUtil.error(
                HttpStatus.CONFLICT,
                ex.getMessage(),
                List.of(ex.getMessage())
        );

    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateEmailException(DuplicateEmailException ex){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .data(null)
                .errors(Collections.emptyList())
                .timestamp(LocalDateTime.now())
                .build();
        log.warn("Duplicate employee email: {}", ex.getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleEmailAlreadyExistsException(EmailAlreadyExistsException ex){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .data(null)
                .errors(Collections.emptyList())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<Object>> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException ex){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message(ex.getMessage())
                .data(null)
                .errors(Collections.emptyList())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException ex){
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Validation Failed")
                .data(null)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
        log.warn("Validation failed for request");
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex){
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message("Something went wrong")
                .data(null)
                .errors(List.of(ex.getMessage()))
                .timestamp((LocalDateTime.now()))
                .build();
        log.error("Unexpected application error", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleEmployeeNotFound(
            EmployeeNotFoundException ex) {

        ApiResponse<Object> response = ApiResponse.builder()
                        .success(false)
                                .message(ex.getMessage())
                                        .data(null).errors(List.of(ex.getMessage())).timestamp(LocalDateTime.now()).build();

        log.warn("Employee not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
