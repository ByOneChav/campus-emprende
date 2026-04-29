package com.zosh.payload.request;


import lombok.Data;


@Data
public class ResetPasswordRequest {
    private String token;
    private String password;
}
