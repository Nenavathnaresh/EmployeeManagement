package Naresh.employee_management.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class EmployeeResponse {
    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String designation;

    private BigDecimal salary;

    private String department;

    private LocalDateTime dateOfJoining;

    private Boolean active;

    private LocalDateTime cratedAt;

    private LocalDateTime updatedAt;
}
