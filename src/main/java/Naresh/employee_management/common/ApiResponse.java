package Naresh.employee_management.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;

    private String message;

    private T data;

    private List<String> errors;

    private LocalDateTime timestamp;
}
