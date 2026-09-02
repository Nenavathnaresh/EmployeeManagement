package Naresh.employee_management.auth.controller;

import Naresh.employee_management.auth.dto.request.LoginRequest;
import Naresh.employee_management.auth.dto.request.RegisterUserRequest;
import Naresh.employee_management.auth.dto.response.LoginResponse;
import Naresh.employee_management.auth.dto.response.UserResponse;
import Naresh.employee_management.auth.service.AuthService;
import Naresh.employee_management.common.ApiResponse;
import Naresh.employee_management.common.ApiResponseUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterUserRequest request){
        UserResponse response = authService.register(request);
        return ApiResponseUtil.created(
                "User registered successfully",
                response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = authService.login(request);
        return ApiResponseUtil.ok(  "Login successful",
                response);
    }
}
