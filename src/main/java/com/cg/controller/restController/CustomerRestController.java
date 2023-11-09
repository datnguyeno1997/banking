package com.cg.controller.restController;

import com.cg.model.*;
import com.cg.model.dto.request.DepositReqDTO;
import com.cg.model.dto.request.TransferReqDTO;
import com.cg.model.dto.request.WithdrawReqDTO;
import com.cg.model.dto.response.CustomerResDTO;
import com.cg.model.dto.response.HistoryResDTO;
import com.cg.model.dto.response.TransferResDTO;
import com.cg.repository.ILocationRegionRepository;
import com.cg.service.customer.ICustomerService;
import com.cg.utils.AppUtils;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@AllArgsConstructor
public class CustomerRestController {

    private ICustomerService customerService;

    private AppUtils appUtils;

    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        List<CustomerResDTO> customerResDTOS = customerService.findAllCustomerResDTO();
        return new ResponseEntity<>(customerResDTOS, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Customer customer) {
        Customer newCustomer = customerService.createCustomer(customer);
        CustomerResDTO newCustomerResDTO = newCustomer.toCustomerResDTO();
        return new ResponseEntity<>(newCustomerResDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
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
    public ResponseEntity<?> deposit(@RequestBody DepositReqDTO depositReqDTO, BindingResult bindingResult) {

        new DepositReqDTO().validate(depositReqDTO, bindingResult);

        if(bindingResult.hasFieldErrors()) {
            return appUtils.mapErrorToResponse(bindingResult);
        }

        Optional<Customer> customer = customerService.findById(Long.valueOf(depositReqDTO.getCustomerId()));
        BigDecimal transactionAmount = BigDecimal.valueOf(Long.parseLong(String.valueOf(depositReqDTO.getTransactionAmount())));

        Deposit deposit = new Deposit();
        deposit.setCustomer(customer.get());
        deposit.setTransactionAmount(transactionAmount);

        customerService.deposit(deposit);
        Optional<Customer> updateCustomer = customerService.findById(deposit.getCustomer().getId());

        return new ResponseEntity<>(updateCustomer.get().toCustomerResDTO(), HttpStatus.OK);
    }

//    @PostMapping("/deposit")
//    public ResponseEntity<?> deposit(@RequestBody Deposit deposit) {
//
//        Optional<Customer> customer = customerService.findById(deposit.getCustomer().getId());
//        BigDecimal transactionAmount = deposit.getTransactionAmount();
//
//        deposit.setCustomer(customer.get());
//        deposit.setTransactionAmount(transactionAmount);
//
//        customerService.deposit(deposit);
//        Optional<Customer> updateCustomer = customerService.findById(deposit.getCustomer().getId());
//
//        return new ResponseEntity<>(updateCustomer.get(), HttpStatus.OK);
//    }

    @PostMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody WithdrawReqDTO withdrawReqDTO, BindingResult bindingResult) {
        new WithdrawReqDTO().validate(withdrawReqDTO, bindingResult);
        if(bindingResult.hasFieldErrors()) {
            return appUtils.mapErrorToResponse(bindingResult);
        }

        Optional<Customer> customer = customerService.findById(Long.valueOf(withdrawReqDTO.getCustomerId()));
        BigDecimal transactionAmount = BigDecimal.valueOf(Long.parseLong(withdrawReqDTO.getTransactionAmount()));

        if (transactionAmount.compareTo(customer.get().getBalance()) > 0) {
            FieldError error = new FieldError("withdrawReqDTO", "transactionAmount", "Không đủ tiền để rút");
            bindingResult.addError(error);
            return appUtils.mapErrorToResponse(bindingResult);
        }

        Withdraw withdraw = new Withdraw();
        withdraw.setCustomer(customer.get());
        withdraw.setTransactionAmount(transactionAmount);

        customerService.withdraw(withdraw);
        Optional<Customer> updateCustomer = customerService.findById(withdraw.getCustomer().getId());

        return new ResponseEntity<>(updateCustomer.get().toCustomerResDTO(), HttpStatus.OK);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferReqDTO transferReqDTO, BindingResult bindingResult) {
        new TransferReqDTO().validate(transferReqDTO, bindingResult);
        if(bindingResult.hasFieldErrors()) {
            return appUtils.mapErrorToResponse(bindingResult);
        }

        Optional<Customer> senderOptional = customerService.findById(Long.parseLong(transferReqDTO.getSenderId()));

        BigDecimal transferAmount = new BigDecimal(transferReqDTO.getTransferAmount());
        Long fee = 10L;
        BigDecimal feeAmount = transferAmount.multiply(BigDecimal.valueOf(fee)).divide(BigDecimal.valueOf(100));
        BigDecimal transactionAmount = transferAmount.add(feeAmount);

        if(transactionAmount.compareTo(senderOptional.get().getBalance()) > 0) {
            FieldError fieldError = new FieldError("transferReqDTO", "transferAmount", "Số tiền trong tài khoản không đủ để thực hiện giao dịch");
            bindingResult.addError(fieldError);
            return appUtils.mapErrorToResponse(bindingResult);
        }


        customerService.transfer(transferReqDTO);

        TransferResDTO transferResDTO = new TransferResDTO();

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
