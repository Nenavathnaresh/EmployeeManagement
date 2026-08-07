package Naresh.employee_management.mapper;

import Naresh.employee_management.dto.request.CreateEmployeeRequest;
import Naresh.employee_management.dto.request.UpdateEmployeeRequest;
import Naresh.employee_management.dto.response.EmployeeResponse;
import Naresh.employee_management.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
public interface EmployeeMapper extends BaseMapper<CreateEmployeeRequest,UpdateEmployeeRequest,EmployeeResponse,Employee> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "deleted", constant = "false")
    public Employee toEntity(CreateEmployeeRequest request);

    @Override
    public EmployeeResponse toResponse(Employee employee);

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    void updateEntity(UpdateEmployeeRequest request,
                      @MappingTarget Employee employee);

}


//
//@Component
//public class EmployeeMapper {
//    public Employee toEntity(CreateEmployeeRequest request){
//        return Employee.builder()
//                .firstName(request.getFirstName())
//                .lastName(request.getLastName())
//                .email(request.getEmail())
//                .phoneNumber(request.getPhoneNumber())
//                .designation(request.getDesignation())
//                .salary(request.getSalary())
//                .department(request.getDepartment())
//                .dateOfJoining(request.getDateOfJoining())
//                .active(true)
//                .deleted(false)
//                .build();
//    }
//
//    public EmployeeResponse toResponse(Employee employee){
//        return EmployeeResponse.builder()
//                .id(employee.getId())
//                .firstName(employee.getFirstName())
//                .lastName(employee.getLastName())
//                .email(employee.getEmail())
//                .phoneNumber(employee.getPhoneNumber())
//                .designation(employee.getDesignation())
//                .salary(employee.getSalary())
//                .department(employee.getDepartment())
//                .dateOfJoining(employee.getDateOfJoining())
//                .active(employee.getActive())
//                .cratedAt(employee.getCreatedAt())
//                .updatedAt(employee.getUpdatedAt())
//                .build();
//    }
//
//    public void updateEntity(Employee employee, UpdateEmployeeRequest request){
//        employee.setFirstName(request.getFirstName());
//        employee.setLastName(request.getLastName());
//        employee.setEmail(request.getEmail());
//        employee.setDesignation(request.getDesignation());
//        employee.setPhoneNumber(request.getPhoneNumber());
//        employee.setSalary(request.getSalary());
//        employee.setDepartment(request.getDepartment());
//        employee.setDateOfJoining(request.getDateOfJoining());
//
//    }
//}
