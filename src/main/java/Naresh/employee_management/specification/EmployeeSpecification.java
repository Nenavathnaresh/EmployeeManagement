package Naresh.employee_management.specification;

import Naresh.employee_management.entity.Employee;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class EmployeeSpecification {
    public static Specification<Employee> hasDepartment(String department){
        return ((root, query, cb) -> cb.equal(root.get("department"),department ));
    }

    public static Specification<Employee> hasDesignation(String designation){
        return ((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("designation"),designation));
    }

    public static Specification<Employee> salaryGreaterThanOrEqualTo(
            BigDecimal salary){
        return (root,query,cb)->
                cb.greaterThanOrEqualTo( root.get("salary"), salary );

    }

    public static Specification<Employee> salaryLessThanOrEqualTo(
            BigDecimal salary){
        return (root,query,cb)-> cb.lessThanOrEqualTo( root.get("salary"),salary );

    }

    public static Specification<Employee> isActive(Boolean active) {

        return (root, query, cb) ->
                cb.equal(root.get("active"), active);

    }

    public static Specification<Employee> hasKeyword(String keyword){
        return ((root, query, cb) -> {
            String searchPattern = "%" + keyword.toLowerCase() + "%";
            return cb.or(cb.like(cb.lower(root.get("firstName")),searchPattern),
                    cb.like(cb.lower(root.get("lastName")),searchPattern),
                    cb.like(cb.lower(root.get("email")),searchPattern),
                    cb.like(cb.lower(root.get("department")),searchPattern),
                    cb.like(cb.lower(root.get("designation")),searchPattern)
                    );
        });
    }

    public static Specification<Employee> isNotDeleted(){
        return (root, query, cb) -> cb.isFalse(root.get("deleted"));
    }
}

