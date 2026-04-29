package com.zosh.payload.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardResponse {
    private long totalUsers;
    private long pendingServices;
    private long approvedServices;
    private long rejectedServices;
    private long inactiveServices;
    private long totalRequests;
    private long pendingReports;
}
