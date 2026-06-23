package com.faai.backend.service;

import com.faai.backend.model.User;
import com.faai.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        if (userRepository.findByPhone(user.getPhone()).isPresent()) {
            throw new RuntimeException("User already exists with this phone number");
        }
        if ("seller".equals(user.getRole()) && user.getStoreName() == null) {
            user.setStoreName(user.getName() + "'s Farm Shop");
            user.setDescription("Fresh vegetables and fruits directly from the farm.");
        }
        return userRepository.save(user);
    }

    public User login(String phone, String role, String pin) {
        Optional<User> userOpt = userRepository.findByPhone(phone);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found. Please register.");
        }
        User user = userOpt.get();
        if (pin != null && user.getPin() != null && !user.getPin().equals(pin)) {
            throw new RuntimeException("Invalid PIN");
        }
        if (role != null && !role.equals(user.getRole())) {
            user.setRole(role);
            if ("seller".equals(role) && user.getStoreName() == null) {
                user.setStoreName(user.getName() + "'s Farm Shop");
                user.setDescription("Fresh vegetables and fruits directly from the farm.");
            }
            userRepository.save(user);
        }
        return user;
    }

    public List<User> getSellers() {
        return userRepository.findByRole("seller");
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public User updateProfile(String id, User updates) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        if (updates.getName() != null)
            user.setName(updates.getName());
        if (updates.getLatitude() != null)
            user.setLatitude(updates.getLatitude());
        if (updates.getLongitude() != null)
            user.setLongitude(updates.getLongitude());
        if (updates.getAddress() != null)
            user.setAddress(updates.getAddress());
        if (updates.getStoreName() != null)
            user.setStoreName(updates.getStoreName());
        if (updates.getDescription() != null)
            user.setDescription(updates.getDescription());
        return userRepository.save(user);
    }
}
