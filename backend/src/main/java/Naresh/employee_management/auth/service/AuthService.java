package Naresh.employee_management.auth.service;

import Naresh.employee_management.auth.dto.request.LoginRequest;
import Naresh.employee_management.auth.dto.request.RegisterUserRequest;
import Naresh.employee_management.auth.dto.response.LoginResponse;
import Naresh.employee_management.auth.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterUserRequest request);

    LoginResponse login(LoginRequest request);

    void logout(String token);
}
