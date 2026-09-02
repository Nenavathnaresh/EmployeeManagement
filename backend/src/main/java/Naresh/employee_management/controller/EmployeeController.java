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
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private  final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService){
        this.employeeService = employeeService;
    }

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

    @GetMapping()
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeResponse>>> getAllEmployees(
            EmployeeSearchRequest request){
        return ApiResponseUtil.ok(AppConstants.EMPLOYEE_RETRIEVED,employeeService.getAllEmployees(request));

    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id){
        return ApiResponseUtil.ok( AppConstants.EMPLOYEE_RETRIEVED,employeeService.getEmployeeById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(@PathVariable Long id, @Valid @RequestBody UpdateEmployeeRequest request){
        return ApiResponseUtil.ok( AppConstants.EMPLOYEE_UPDATED,employeeService.updateEmployee(id, request));

    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id){
        employeeService.deleteEmployee(id);
        return ApiResponseUtil.noContent( AppConstants.EMPLOYEE_UPDATED);
    }
}
