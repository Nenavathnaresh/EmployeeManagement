package Naresh.employee_management.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class EmployeeSearchRequest {
    private int page = 0;

    private int size = 10;

    private String sortBy = "id";

    private String direction = "asc";

    private String search = "";

    private String department;

    private String designation;

    private Boolean active;

    private BigDecimal minSalary;

    private BigDecimal maxSalary;

}
