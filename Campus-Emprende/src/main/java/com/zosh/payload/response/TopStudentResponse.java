package com.zosh.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopStudentResponse {
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private Long totalServices;
    private Long totalRequests;
    private Long completedRequests;
    private Double averageRating;
}
