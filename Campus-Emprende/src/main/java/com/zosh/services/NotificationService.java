package com.zosh.services;

import com.zosh.domain.NotificationType;
import com.zosh.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    void createNotification(Long recipientId, Long actorId, NotificationType type, String message, String targetUrl);
    Page<Notification> getUserNotifications(Long userId, Pageable pageable);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId);
}
