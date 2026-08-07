package Naresh.employee_management.exception;

public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String message){
        super(message);
    }
}
