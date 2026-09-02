package Naresh.employee_management.service;


import Naresh.employee_management.common.PageResponse;
import Naresh.employee_management.dto.request.CreateEmployeeRequest;
import Naresh.employee_management.dto.request.EmployeeSearchRequest;
import Naresh.employee_management.dto.request.UpdateEmployeeRequest;
import Naresh.employee_management.dto.response.EmployeeResponse;

import java.util.List;

public interface EmployeeService {

    EmployeeResponse createEmployee(CreateEmployeeRequest request);

    PageResponse<EmployeeResponse> getAllEmployees(EmployeeSearchRequest request);
//    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(Long id);

    EmployeeResponse updateEmployee(Long id,
                                    UpdateEmployeeRequest request);

    void deleteEmployee(Long id);
}
