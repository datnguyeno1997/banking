package com.cg.controller;

import com.cg.model.*;
import com.cg.model.dto.response.CustomerResDTO;
import com.cg.model.dto.response.HistoryResDTO;
import com.cg.service.customer.CustomerServiceImpl;
import com.cg.service.customer.ICustomerService;
import lombok.AllArgsConstructor;
import org.dom4j.rule.Mode;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.awt.color.ICC_ColorSpace;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/customers")
@AllArgsConstructor
public class CustomerController {

    private final ICustomerService customerService;

    @GetMapping
    public String showListPage(Model model) {
        return "customer/list";
    }


}


















