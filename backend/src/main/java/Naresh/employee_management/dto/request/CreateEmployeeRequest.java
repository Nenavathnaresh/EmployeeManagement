package Naresh.employee_management.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema( description = "Request payload used to create or update an employee")
@Getter
@Setter
public class CreateEmployeeRequest {

    @Schema(
            description = "Employee first name",
            example = "John"
    )
    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    private String firstName;

    @Schema(
            description = "Employee last name",
            example = "Doe"
    )
    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    private String lastName;

    @Schema(
            description = "Employee email address",
            example = "john.doe@example.com"
    )
    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email")
    private String email;

    @Schema(description = "Employee phone number", example = "9876543219" )
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must contain exactly 10 digits")
    private String phoneNumber;

    @Schema(description = "Employee designation", example = "Software Engineer" )
    @NotBlank(message = "Designation is required")
    private String designation;

    @Schema(description = "Employee salary", example = "543219" )
    @NotNull(message = "Salary is required")
    @Positive(message = "Salary must be greater than zero")
    private BigDecimal salary;

    @Schema(description = "Employee department", example = "IT" )
    @NotBlank(message = "Department is required")
    private String department;

    @Schema(description = "Employee date of joining", example = "2026-07-11T00:00:00" )
    @NotNull(message = "Date of joining is required")
    private LocalDateTime dateOfJoining;

}
