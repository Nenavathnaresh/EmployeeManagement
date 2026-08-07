package Naresh.employee_management.auth.dto.response;

import Naresh.employee_management.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private Long id;

    private String username;

    private String email;

    private Role role;

    private Boolean enabled;
}
