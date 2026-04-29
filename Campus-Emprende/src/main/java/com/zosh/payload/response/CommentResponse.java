package com.zosh.payload.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private Long serviceId;
    private Long authorId;
    private String authorName;
    private String content;
    private LocalDateTime createdAt;
}
