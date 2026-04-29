package com.zosh.services;

import com.zosh.exception.UserException;

import com.zosh.payload.response.AuthResponse;
import com.zosh.payload.response.UserDTO;


public interface AuthService {
    AuthResponse login(String username, String password) throws UserException;
    AuthResponse signup(UserDTO req) throws UserException;

    void createPasswordResetToken(String email) throws UserException;
    void resetPassword(String token, String newPassword);
}
