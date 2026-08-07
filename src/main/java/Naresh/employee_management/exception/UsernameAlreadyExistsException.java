package Naresh.employee_management.exception;

public class UsernameAlreadyExistsException extends RuntimeException{
    public UsernameAlreadyExistsException(String message){
        super(message);
    }
}
