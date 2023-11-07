package com.cg.model.dto.response;

import com.cg.model.Customer;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.persistence.Entity;
import java.math.BigDecimal;
import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class HistoryResDTO {
    private Long id;

    private String sender;

    private String recipient;

    private BigDecimal transactionAmount;

    private Date transactionDate;

    public HistoryResDTO(Long id, String sender, String recipient, BigDecimal transactionAmount, Date transactionDate) {
        this.id = id;
        this.sender = sender;
        this.recipient = recipient;
        this.transactionAmount = transactionAmount;
        this.transactionDate = transactionDate;
    }
}
