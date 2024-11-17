package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;
import java.security.Principal;

@Controller
public class ViewController {

    private final UserService userService;

    @Autowired
    public ViewController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public String user(ModelMap model, Principal principal) {
        User authenticatedUser = userService.findByUsername(principal.getName());
        model.addAttribute("authenticatedUserRoles", authenticatedUser.getRoles());
        return "user";
    }

    @GetMapping("/userAdmin")
    public String userAdmin(ModelMap model, Principal principal) {
        User authenticatedUser = userService.findByUsername(principal.getName());
        model.addAttribute("authenticatedUserRoles", authenticatedUser.getRoles());
        return "userAdmin";
    }

    @GetMapping("/admin")
    public String admin(ModelMap model, Principal principal) {
        User authenticatedUser = userService.findByUsername(principal.getName());
        model.addAttribute("authenticatedUserRoles", authenticatedUser.getRoles());
        return "admin";
    }
}