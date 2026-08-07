package Naresh.employee_management.mapper;

import org.mapstruct.MappingTarget;

public interface BaseMapper <REQUEST,UPDATE_REQUEST,RESPONSE,ENTITY>{

    ENTITY toEntity(REQUEST request);
    RESPONSE toResponse(ENTITY entity);
    void updateEntity(UPDATE_REQUEST request,@MappingTarget ENTITY entity);
}
