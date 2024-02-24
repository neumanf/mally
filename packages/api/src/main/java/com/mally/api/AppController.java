package com.mally.api;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class AppController {

    @RequestMapping("/")
    public String index() {
        return "Hello World";
    }
}