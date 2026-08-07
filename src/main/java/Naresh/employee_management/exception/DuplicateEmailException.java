package Naresh.employee_management.exception;

public class DuplicateEmailException extends RuntimeException{
    public DuplicateEmailException(String message){
        super(message);
    }
}
