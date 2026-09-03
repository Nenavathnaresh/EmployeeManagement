package Naresh.employee_management.auth.controller;

import Naresh.employee_management.auth.dto.request.LoginRequest;
import Naresh.employee_management.auth.dto.request.RegisterUserRequest;
import Naresh.employee_management.auth.dto.response.LoginResponse;
import Naresh.employee_management.auth.dto.response.UserResponse;
import Naresh.employee_management.auth.service.AuthService;
import Naresh.employee_management.common.ApiResponse;
import Naresh.employee_management.common.ApiResponseUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(
        name = "Authentication",
        description = "APIs for user registration and authentication"
)
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Register user",
            description = "Registers a new user account"
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "User registered successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid registration request"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "Username or email already exists"
            )
    })
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterUserRequest request){
        UserResponse response = authService.register(request);
        return ApiResponseUtil.created(
                "User registered successfully",
                response);
    }

    @Operation(
            summary = "User login",
            description = "Authenticates a user and returns a JWT access token"
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Login successful"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid login request"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Invalid username or password"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request){
        LoginResponse response = authService.login(request);
        return ApiResponseUtil.ok(  "Login successful",
                response);
    }

    @PostMapping("/logout")
    @Operation(
            summary = "User logout",
            description = "Jwt token blacklist/revocation mechanism"
    )
    public ResponseEntity<ApiResponse<Void>> logout(@RequestHeader("Authorization") String authorizationHeader){
        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            throw new IllegalArgumentException(
                    "Invalid Authorization header"
            );
        }
        String token = authorizationHeader.substring(7);
        authService.logout(token);
        return ApiResponseUtil.ok("Logout successful",null);
    }
}
