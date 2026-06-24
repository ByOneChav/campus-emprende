package com.zosh.services.impl;

import com.zosh.domain.NotificationType;
import com.zosh.model.Notification;
import com.zosh.model.User;
import com.zosh.repository.NotificationRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createNotification(Long recipientId, Long actorId, NotificationType type, String message, String targetUrl) {
        if (recipientId.equals(actorId)) return; // No notificar a sí mismo

        User recipient = userRepository.findById(recipientId).orElseThrow();
        User actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;

        Notification notification = Notification.builder()
            .recipient(recipient)
            .actor(actor)
            .type(type)
            .message(message)
            .targetUrl(targetUrl)
            .isRead(false)
            .build();
            
        notificationRepository.save(notification);
    }

    @Override
    public Page<Notification> getUserNotifications(Long userId, Pageable pageable) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}
