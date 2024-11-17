package ru.kata.spring.boot_security.demo.init;

import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;
import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Component
public class UsersInit {

    private final UserService userService;

    public UsersInit(UserService userService) {
        this.userService = userService;
    }

    @PostConstruct
    public void initializeUsers() {
        User user = userService.findByUsername("admin");
        if (user == null) {
            Role adminRole = new Role("ROLE_ADMIN");
            List<Role> adminRoles = new ArrayList<>();
            adminRoles.add(adminRole);
            User admin = new User( adminRoles,"admin", "admin@kata.ru", "admin");
            userService.saveUser(admin);
        }
        User user1 = userService.findByUsername("user");
        if (user1 == null) {
            Role userRole = new Role("ROLE_USER");
            List<Role> adminRoles = new ArrayList<>();
            adminRoles.add(userRole);
            User user2 = new User( adminRoles,"user", "user@kata.ru", "user");
            userService.saveUser(user2);
        }
    }
}

