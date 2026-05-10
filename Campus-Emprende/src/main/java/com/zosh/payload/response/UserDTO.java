package com.zosh.payload.response;

import com.zosh.domain.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UserDTO {

    private Long id;
    private String email;
    private String phone;
    private String fullName;
    private UserRole role;
    private String username;
    private LocalDateTime lastLogin;
    private Boolean verified;
}
