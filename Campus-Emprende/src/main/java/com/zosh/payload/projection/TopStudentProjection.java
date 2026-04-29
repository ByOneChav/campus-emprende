package com.zosh.payload.projection;

public interface TopStudentProjection {
    Long getStudentId();
    String getStudentName();
    String getStudentEmail();
    Long getTotalServices();
    Long getTotalRequests();
    Long getCompletedRequests();
    Double getAverageRating();
}
