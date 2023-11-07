package com.cg.controller.restController;

import com.cg.model.Customer;
import com.cg.model.Deposit;
import com.cg.model.Withdraw;
import com.cg.model.dto.request.DepositReqDTO;
import com.cg.model.dto.request.TransferReqDTO;
import com.cg.model.dto.request.WithdrawReqDTO;
import com.cg.model.dto.response.CustomerResDTO;
import com.cg.model.dto.response.HistoryResDTO;
import com.cg.model.dto.response.TransferResDTO;
import com.cg.service.customer.ICustomerService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@AllArgsConstructor
public class CustomerRestController {

    private ICustomerService customerService;

    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        List<CustomerResDTO> customerResDTOS = customerService.findAllCustomerResDTO();
        return new ResponseEntity<>(customerResDTOS, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CustomerResDTO> create(@RequestBody Customer customer) {
        Customer newCustomer = customerService.createCustomer(customer);
        CustomerResDTO newCustomerResDTO = newCustomer.toCustomerResDTO();
        return new ResponseEntity<>(newCustomerResDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResDTO> getById(@PathVariable Long id) {
        Optional<Customer> customerOptional = customerService.findById(id);

        Customer customer = customerOptional.get();

        CustomerResDTO customerResDTO = customer.toCustomerResDTO();

        return new ResponseEntity<>(customerResDTO, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Customer> update(@RequestBody Customer customer) {
        Customer customerUpdate = customerService.update(customer);

        return new ResponseEntity<>(customerUpdate, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Customer> delete(@PathVariable Long id) {
        customerService.removeById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody DepositReqDTO depositReqDTO) {

        Optional<Customer> customer = customerService.findById(Long.valueOf(depositReqDTO.getCustomerId()));
        BigDecimal transactionAmount = BigDecimal.valueOf(Long.parseLong(String.valueOf(depositReqDTO.getTransactionAmount())));

        Deposit deposit = new Deposit();
        deposit.setCustomer(customer.get());
        deposit.setTransactionAmount(transactionAmount);

        customerService.deposit(deposit);
        Optional<Customer> updateCustomer = customerService.findById(deposit.getCustomer().getId());

        return new ResponseEntity<>(updateCustomer.get().toCustomerResDTO(), HttpStatus.OK);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody WithdrawReqDTO withdrawReqDTO) {
        Optional<Customer> customer = customerService.findById(Long.valueOf(withdrawReqDTO.getCustomerId()));
        BigDecimal transactionAmount = BigDecimal.valueOf(Long.parseLong(withdrawReqDTO.getTransactionAmount()));

        Withdraw withdraw = new Withdraw();
        withdraw.setCustomer(customer.get());
        withdraw.setTransactionAmount(transactionAmount);

        customerService.withdraw(withdraw);
        Optional<Customer> updateCustomer = customerService.findById(withdraw.getCustomer().getId());

        return new ResponseEntity<>(updateCustomer.get().toCustomerResDTO(), HttpStatus.OK);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferReqDTO transferReqDTO) {
        customerService.transfer(transferReqDTO);

        TransferResDTO transferResDTO = new TransferResDTO();
        Optional<Customer> senderOptional = customerService.findById(Long.parseLong(transferReqDTO.getSenderId()));
        Optional<Customer> recipientOptional = customerService.findById(Long.parseLong(transferReqDTO.getRecipientId()));

        CustomerResDTO sender = senderOptional.get().toCustomerResDTO();
        CustomerResDTO recipient = recipientOptional.get().toCustomerResDTO();

        transferResDTO.setSender(sender);
        transferResDTO.setRecipient(recipient);

        return new ResponseEntity<>(transferResDTO, HttpStatus.OK);
    }

    @GetMapping("/histories")
    public ResponseEntity<?> getAllHistories() {
        List<HistoryResDTO> histories = customerService.findAllHistory();

        return new ResponseEntity<>(histories, HttpStatus.OK);
    }
}
