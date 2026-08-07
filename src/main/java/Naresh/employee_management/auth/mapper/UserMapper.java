package Naresh.employee_management.auth.mapper;

import Naresh.employee_management.auth.dto.request.RegisterUserRequest;
import Naresh.employee_management.auth.dto.response.UserResponse;
import Naresh.employee_management.entity.User;
import Naresh.employee_management.mapper.BaseMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper extends BaseMapper<RegisterUserRequest,RegisterUserRequest, UserResponse, User> {

    @Override
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "enabled", constant = "true")
    User toEntity(RegisterUserRequest request);

    @Override
    UserResponse toResponse(User user);

    @Override
    default void updateEntity(RegisterUserRequest request,User user){
        throw new UnsupportedOperationException( "Update operation is not supported for UserMapper");
    }
}
