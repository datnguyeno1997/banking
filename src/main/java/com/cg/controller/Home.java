package com.cg.controller;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/customers")
@AllArgsConstructor
public class Home {
    @GetMapping
    public String showListPage() {
        return "customer/list";
    }

}


















