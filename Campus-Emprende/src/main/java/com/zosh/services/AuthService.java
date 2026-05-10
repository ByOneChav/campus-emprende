package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.SignupRequest;
import com.zosh.payload.response.AuthResponse;

public interface AuthService {

    AuthResponse login(String username, String password) throws UserException;

    AuthResponse signup(SignupRequest req) throws UserException;

    void createPasswordResetToken(String email) throws UserException;

    void resetPassword(String token, String newPassword);
}
