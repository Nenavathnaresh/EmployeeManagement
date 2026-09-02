package Naresh.employee_management.auth.dto.response;

import Naresh.employee_management.entity.Role;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String token;
    private String tokenType;
}
