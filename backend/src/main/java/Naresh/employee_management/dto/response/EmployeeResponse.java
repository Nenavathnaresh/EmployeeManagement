package Naresh.employee_management.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Schema(description = "Employee information returned by the API")
@Getter
@Builder
public class EmployeeResponse {
    @Schema(
            description = "Unique employee identifier",
            example = "1"
    )
    private Long id;

    @Schema(
            description = "Employee first name",
            example = "John"
    )
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
