package Naresh.employee_management.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI employeeManagementOpenAPI(){
        return new OpenAPI()
                .info(new Info().title("Employee Management API").description("""
                REST API for Employee Management System.
                API Version: v1
                This API provides employee management,
                authentication, authorization, pagination,
                filtering and soft-delete functionality.
                """).version("1.0.0").contact(new Contact().name("Employee Management Team")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Local Development Server")
                ))
                .components(new Components().addSecuritySchemes("bearerAuth",new SecurityScheme().name("Authorization").type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
