package Naresh.employee_management.service.impl;

import Naresh.employee_management.common.PageResponse;
import Naresh.employee_management.dto.request.CreateEmployeeRequest;
import Naresh.employee_management.dto.request.EmployeeSearchRequest;
import Naresh.employee_management.dto.request.UpdateEmployeeRequest;
import Naresh.employee_management.dto.response.EmployeeResponse;
import Naresh.employee_management.entity.Employee;
import Naresh.employee_management.exception.DuplicateEmailException;
import Naresh.employee_management.exception.EmployeeNotFoundException;
import Naresh.employee_management.mapper.EmployeeMapper;
import Naresh.employee_management.repository.EmployeeRepository;
import Naresh.employee_management.service.EmployeeService;
import Naresh.employee_management.specification.EmployeeSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);

    public EmployeeServiceImpl(EmployeeRepository employeeRepository, EmployeeMapper employeeMapper){
        this.employeeRepository = employeeRepository;
        this.employeeMapper = employeeMapper;
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request){
        logger.info("Creating employee with email {}",request.getEmail());
        if(employeeRepository.existsByEmailAndDeletedFalse(request.getEmail())){
            throw new DuplicateEmailException("Employee already exists with email : " + request.getEmail());
        }

        Employee employee = employeeMapper.toEntity(request);
        Employee savedEmployee = employeeRepository.save(employee);

        logger.info("Employee created successfully with id {}",savedEmployee.getEmail());
        return employeeMapper.toResponse(savedEmployee);

//        Employee employee = Employee.builder()
//                .firstName(request.getFirstName())
//                .lastName(request.getLastName())
//                .email(request.getEmail())
//                .phoneNumber(request.getPhoneNumber())
//                .designation(request.getDesignation())
//                .salary(request.getSalary())
//                .department(request.getDepartment())
//                .dateOfJoining(request.getDateOfJoining())
//                .active(true)
//                .build();


//        return EmployeeResponse.builder().id(savedEmployee.getId())
//                .firstName(savedEmployee.getFirstName())
//                .lastName(savedEmployee.getLastName())
//                .email(savedEmployee.getEmail())
//                .phoneNumber(savedEmployee.getPhoneNumber())
//                .designation(savedEmployee.getDesignation())
//                .salary(savedEmployee.getSalary())
//                .department(savedEmployee.getDepartment())
//                .dateOfJoining(savedEmployee.getDateOfJoining())
//                .active(savedEmployee.getActive())
//                .build();

    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<EmployeeResponse> getAllEmployees(EmployeeSearchRequest request){

//        Specification<Employee> specification = Specification.where(null);

            Specification<Employee> specification = Specification.where(EmployeeSpecification.isNotDeleted());

        if(request.getSearch() != null && !request.getSearch().isBlank()){
            specification = specification.and(EmployeeSpecification.hasKeyword(request.getSearch().trim()));
        }

        // Step 2 - Department Filter
        if(request.getDepartment() != null && !request.getDepartment().isBlank()){
            specification = specification.and(EmployeeSpecification.hasDepartment(request.getDepartment()));
        }
        // Step 3 - Designation Filter
        if (request.getDesignation() != null &&
                !request.getDesignation().isBlank()) {

            specification = specification.and(
                    EmployeeSpecification.hasDesignation(
                            request.getDesignation()));
        }

        // Step 4 - Minimum Salary Filter
        if (request.getMinSalary() != null) {

            specification = specification.and(
                    EmployeeSpecification.salaryGreaterThanOrEqualTo(
                            request.getMinSalary()));
        }

        // Step 5 - Maximum Salary Filter
        if (request.getMaxSalary() != null) {

            specification = specification.and(
                    EmployeeSpecification.salaryLessThanOrEqualTo(
                            request.getMaxSalary()));
        }

        if (request.getActive() != null) {

            specification = specification.and(
                    EmployeeSpecification.isActive(
                            request.getActive()));
        }

        Sort sort = request.getDirection().equalsIgnoreCase("desc") ?
                Sort.by(request.getSortBy()).descending()
                : Sort.by(request.getSortBy()).ascending();
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        Page<Employee> employeePage = employeeRepository.findAll(specification,pageable) ;

//        if(request.getSearch() == null || request.getSearch().isBlank()){
//            employeePage = employeeRepository.findAll(pageable);
//        }else {
//            employeePage = employeeRepository.searchEmployees(request.getSearch().trim(),pageable);
//        }

        List<EmployeeResponse> employees = employeePage.getContent()
                .stream()
                .map(employeeMapper::toResponse)
                .toList();

        return PageResponse.<EmployeeResponse>builder()
                .content(employees)
                .pageNumber(employeePage.getNumber())
                .pageSize(employeePage.getSize())
                .totalElements(employeePage.getTotalElements())
                .totalPages(employeePage.getTotalPages())
                .first(employeePage.isFirst())
                .last(employeePage.isLast())
                .build();

//        return employeeRepository.findAll()
//                .stream()
//                .map(employeeMapper::toResponse)
//                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {

        Employee employee = getEmployeeOrThrow(id);
//        Employee employee = findEmployeeById(id);

        return employeeMapper.toResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request) {
        logger.info("Updating employee {}",id);
        Employee employee = getEmployeeOrThrow(id);
//        Employee employee = findEmployeeById(id);

        validateDuplicateEmail(employee,request.getEmail());

//        if (!employee.getEmail().equals(request.getEmail())
//                && employeeRepository.existsByEmail(request.getEmail())) {
//
//            throw new DuplicateEmailException(
//                    "Employee already exists with email : "
//                            + request.getEmail());
//        }

        employeeMapper.updateEntity(request, employee);

        Employee updatedEmployee =
                employeeRepository.save(employee);

        return employeeMapper.toResponse(updatedEmployee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        logger.info("Deleting employee {}", id);

        Employee employee = getEmployeeOrThrow(id);
//        Employee employee = employeeRepository.findById(id)
//                .orElseThrow(() ->
//                        new EmployeeNotFoundException( "Employee not found"));

        employee.setDeleted(true);
        employeeRepository.save(employee);
//        employeeRepository.delete(employee);
    }

    private Employee findEmployeeById(Long id){
        return employeeRepository.findById(id).orElseThrow(()-> {
            logger.error("Employee not found with id {}", id);
           return  new EmployeeNotFoundException("Employee not found with id : " + id);
        });
    }

    private void validateDuplicateEmail(Employee employee, String email){
        if(employee.getEmail().equals(email) && employeeRepository.existsByEmailAndDeletedFalse(email)){
            throw new DuplicateEmailException( "Employee already exists with email : " + email);
        }
    }

    private Employee getEmployeeOrThrow(Long id){
        return employeeRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(()->new EmployeeNotFoundException("Employee not found with id: " + id));
    }
}
