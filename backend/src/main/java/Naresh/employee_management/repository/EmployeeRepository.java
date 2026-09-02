package Naresh.employee_management.repository;

import Naresh.employee_management.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Long>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByIdAndDeletedFalse(Long id);
    Optional<Employee> findByEmailAndDeletedFalse(String email);
    boolean existsByEmailAndDeletedFalse(String email);

//    @Query("""
//        SELECT e FROM Employee e
//        WHERE
//               LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%'))
//               OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))
//               OR LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
//               OR LOWER(e.department) LIKE LOWER(CONCAT('%', :keyword, '%'))
//               OR LOWER(e.designation) LIKE LOWER(CONCAT('%', :keyword, '%'))
//        """)
//    Page<Employee> searchEmployees(@Param("keyword") String keyword, Pageable pageable);
}
