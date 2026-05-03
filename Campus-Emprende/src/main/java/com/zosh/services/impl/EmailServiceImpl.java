package com.zosh.services.impl;

import com.zosh.payload.response.EmailNotificationDTO;
import com.zosh.services.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service // servicio Spring
@RequiredArgsConstructor // inyección automática de dependencias
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class); // logger para monitoreo

    private final JavaMailSender javaMailSender; // cliente SMTP de Spring

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage(); // crea email
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8"); // helper para facilitar armado

            helper.setSubject(subject); // asunto
            helper.setText(body, true); // cuerpo (true = HTML)
            helper.setTo(to); // destinatario
            javaMailSender.send(mimeMessage); // envío real

            logger.info("Email sent successfully to: {}", to); // log éxito
        } catch (MailException | MessagingException e) {
            logger.error("Failed to send email to: {}", to, e); // log error
            throw new MailSendException("Failed to send email"); // excepción controlada
        }
    }

    @Override
    public void sendEmail(EmailNotificationDTO notification) {
        // usa DTO para construir email simple
        sendEmail(notification.getRecipient(), notification.getSubject(), buildSimpleBody(notification));
    }

    @Override
    public void sendTemplatedEmail(EmailNotificationDTO notification) {
        // construye HTML y lo envía
        String htmlBody = buildHtmlBody(notification.getTemplateName(), notification.getTemplateData());
        sendEmail(notification.getRecipient(), notification.getSubject(), htmlBody);
    }


    // ==================== MÉTODOS DE AYUDA====================

    private String buildSimpleBody(EmailNotificationDTO notification) {
        // obtiene mensaje desde templateData
        if (notification.getTemplateData() != null && notification.getTemplateData().containsKey("message")) {
            return notification.getTemplateData().get("message").toString();
        }
        return ""; // fallback vacío
    }

    private String buildHtmlBody(String templateName, Object templateData) {
        // placeholder de template (en producción usar Thymeleaf)
        return "<html><body><p>Template: " + templateName + "</p></body></html>";
    }
}
