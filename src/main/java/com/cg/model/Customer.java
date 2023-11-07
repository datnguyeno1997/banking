package com.cg.model;
import com.cg.model.dto.response.CustomerResDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Where(clause = "deleted = 0")
@SQLDelete(sql = "UPDATE customers SET `deleted` = 1 WHERE (`id` = ?);")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    private String email;

    private String phone;

    private String address;

    @Column(precision = 10, scale = 0, nullable = false, updatable = false)
    private BigDecimal balance;

    @OneToMany(mappedBy = "sender")
    private List<Transfer> transferSender;

    @OneToMany(mappedBy = "recipient")
    private List<Transfer> transferRecipient;

    private Boolean deleted = false;

    public CustomerResDTO toCustomerResDTO() {
        return new CustomerResDTO()
                .setId(id)
                .setFullName(fullName)
                .setAddress(address)
                .setEmail(email)
                .setPhone(phone)
                .setBalance(balance);
    }

}
