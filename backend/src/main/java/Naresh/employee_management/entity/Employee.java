package Naresh.employee_management.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Employee extends BaseEntity {

    @Column(name = "first_name", nullable = false,length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false,length = 50)
    private String lastName;

    @Column(nullable = false,unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", nullable = false,length = 10)
    private String phoneNumber;

    @Column( nullable = false,length = 100)
    private String designation;

    @Column(nullable = false,precision = 10, scale = 2)
    private BigDecimal salary;

    @Column( nullable = false,length = 100)
    private String department;

    @Column(name = "date_of_joining", nullable = false)
    private LocalDateTime dateOfJoining;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false)
    private Boolean deleted = false;

}
