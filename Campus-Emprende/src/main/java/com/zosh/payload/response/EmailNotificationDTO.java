package com.zosh.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for email notification details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotificationDTO {

    private String recipient; // destinatario del correo

    private String subject; // asunto del email

    private String templateName; // nombre del template (para emails HTML)

    private Map<String, Object> templateData; // datos dinámicos para el template

    public EmailNotificationDTO(String recipient, String subject) {
        this.recipient = recipient; // constructor simplificado
        this.subject = subject;
    }
}