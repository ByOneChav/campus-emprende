package com.zosh.services;


import com.zosh.payload.response.EmailNotificationDTO;

/**
 * Service interface for sending email notifications
 */
public interface EmailService {

    /**
     * Send a simple email notification
     * @param to Recipient email
     * @param subject Email subject
     * @param body Email body
     */
    void sendEmail(String to, String subject, String body);

    /**
     * Send a simple email notification
     * @param notification Email notification details
     */
    void sendEmail(EmailNotificationDTO notification);

    /**
     * Send an HTML email with template
     * @param notification Email notification with template data
     */
    void sendTemplatedEmail(EmailNotificationDTO notification);




}
