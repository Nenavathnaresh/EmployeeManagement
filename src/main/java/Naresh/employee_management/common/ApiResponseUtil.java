package Naresh.employee_management.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

public final class ApiResponseUtil {
    private ApiResponseUtil(){}

    public static <T>ResponseEntity<ApiResponse<T>> ok(String message,T data){
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .errors(Collections.emptyList())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    public static <T>ResponseEntity<ApiResponse<T>> created(String message,T data){
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .errors(Collections.emptyList())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    public static ResponseEntity<ApiResponse<Void>> noContent(String message) {

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message(message)
                .data(null)
                .errors(Collections.emptyList())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    public static <T>ResponseEntity<ApiResponse<T>> error(HttpStatus status, String message, List<String> errors){
        ApiResponse<T> response = ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .data(null)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(response);
    }
}
