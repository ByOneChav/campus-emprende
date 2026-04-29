package com.zosh.payload.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
}