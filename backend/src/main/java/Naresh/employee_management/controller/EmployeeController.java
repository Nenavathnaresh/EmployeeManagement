package Naresh.employee_management.controller;

import Naresh.employee_management.common.ApiResponse;
import Naresh.employee_management.common.ApiResponseUtil;
import Naresh.employee_management.common.PageResponse;
import Naresh.employee_management.constant.AppConstants;
import Naresh.employee_management.dto.request.CreateEmployeeRequest;
import Naresh.employee_management.dto.request.EmployeeSearchRequest;
import Naresh.employee_management.dto.request.UpdateEmployeeRequest;
import Naresh.employee_management.dto.response.EmployeeResponse;
import Naresh.employee_management.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Tag(name = "Employee Management", description = "APIs for creating, retrieving, updating and deleting employees")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private  final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService){
        this.employeeService = employeeService;
    }

    @Operation(
            summary = "Create employee",
            description = "Creates a new employee. Requires ADMIN role."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "Employee created successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid employee request"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token is missing or invalid"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - ADMIN role required"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Employee with the same email already exists"
            )
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(@Valid @RequestBody CreateEmployeeRequest request){

        return ApiResponseUtil.created("Employee created successfully",employeeService.createEmployee(request));

//        EmployeeResponse employee = employeeService.createEmployee(request);
//
//        ApiResponse<EmployeeResponse> response = ApiResponse.<EmployeeResponse>builder()
//                .success(true)
//                .message("Employee created successfully")
//                .data(employee)
//                .errors(Collections.emptyList())
//                .timestamp(LocalDateTime.now())
//                .build();
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @Operation(summary = "Get all employees", description = "Retrieves a paginated and sorted list of employees with optional filtering")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Employees retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token is missing or invalid"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - insufficient permissions"
            )
    })
    @GetMapping()
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeResponse>>> getAllEmployees(
            EmployeeSearchRequest request){
        return ApiResponseUtil.ok(AppConstants.EMPLOYEE_RETRIEVED,employeeService.getAllEmployees(request));

    }

    @Operation(
            summary = "Get employee by ID",
            description = "Retrieves an employee using the employee ID"
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Employee retrieved successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token is missing or invalid"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - insufficient permissions"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Employee not found"
            )
    })
    @Parameter(description = "Employee ID", example = "1",required = true)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id){
        return ApiResponseUtil.ok( AppConstants.EMPLOYEE_RETRIEVED,employeeService.getEmployeeById(id));
    }

    @Operation(
            summary = "Update employee",
            description = "Updates an existing employee. Requires ADMIN role."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Employee updated successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid employee request"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token is missing or invalid"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - ADMIN role required"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Employee not found"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Employee with the same email already exists"
            )
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(@PathVariable Long id, @Valid @RequestBody UpdateEmployeeRequest request){
        return ApiResponseUtil.ok( AppConstants.EMPLOYEE_UPDATED,employeeService.updateEmployee(id, request));

    }

    @Operation(
            summary = "Delete employee",
            description = "Soft deletes an employee. Requires ADMIN role."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "204",
                    description = "Employee deleted successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Unauthorized - JWT token is missing or invalid"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Forbidden - ADMIN role required"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Employee not found"
            )
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id){
        employeeService.deleteEmployee(id);
        return ApiResponseUtil.noContent( AppConstants.EMPLOYEE_UPDATED);
    }
}
