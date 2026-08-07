package Naresh.employee_management.security.jwt;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtTestRunner implements CommandLineRunner {
    private final JwtService jwtService;

    @Override
    public void run(String... args) {

//        String token =jwtService.generateToken("naresh@gmail.com");
//        System.out.println(token);
//        System.out.println(jwtService.extractUsername(token));
//        System.out.println(jwtService.isTokenValid(token,"naresh@gmail.com"));


    }
}
