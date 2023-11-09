package com.cg.repository;

import com.cg.model.Customer;
import com.cg.model.History;
import com.cg.model.dto.response.CustomerResDTO;
import com.cg.model.dto.response.HistoryResDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IHistoryRepository extends JpaRepository<History, Long> {

    @Query("SELECT NEW com.cg.model.dto.response.HistoryResDTO (" +
            "h.id, " +
            "h.sender.fullName, " +
            "h.recipient.fullName, " +
            "h.transactionAmount, " +
            "h.transactionDate" +
            ") FROM History AS h "
    )
    List<HistoryResDTO> findAllHistoryResDTO();

}
