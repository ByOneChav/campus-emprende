package com.zosh.services;

import com.zosh.payload.response.EmailNotificationDTO;

// Interfaz del servicio de correos (define el contrato)
public interface EmailService {

    // Enviar email simple (texto plano)
    void sendEmail(String to, String subject, String body);

    // Enviar email usando un DTO (más estructurado)
    void sendEmail(EmailNotificationDTO notification);

    // Enviar email con plantilla HTML (más avanzado)
    void sendTemplatedEmail(EmailNotificationDTO notification);
}