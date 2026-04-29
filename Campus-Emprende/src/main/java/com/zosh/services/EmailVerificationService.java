package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.modal.User;

public interface EmailVerificationService {
    void sendVerificationEmail(User user);
    void verifyEmail(String token) throws UserException;
    void resendVerification(String email) throws UserException;
}
