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

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender javaMailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setSubject(subject);
            helper.setText(body, true);
            helper.setTo(to);
            javaMailSender.send(mimeMessage);

            logger.info("Email sent successfully to: {}", to);
        } catch (MailException | MessagingException e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new MailSendException("Failed to send email");
        }
    }

    @Override
    public void sendEmail(EmailNotificationDTO notification) {
        sendEmail(notification.getRecipient(), notification.getSubject(), buildSimpleBody(notification));
    }

    @Override
    public void sendTemplatedEmail(EmailNotificationDTO notification) {
        String htmlBody = buildHtmlBody(notification.getTemplateName(), notification.getTemplateData());
        sendEmail(notification.getRecipient(), notification.getSubject(), htmlBody);
    }


    // ==================== MÉTODOS DE AYUDA====================

    private String buildSimpleBody(EmailNotificationDTO notification) {
        if (notification.getTemplateData() != null && notification.getTemplateData().containsKey("message")) {
            return notification.getTemplateData().get("message").toString();
        }
        return "";
    }

    private String buildHtmlBody(String templateName, Object templateData) {
        // In production, use a template engine like Thymeleaf or FreeMarker
        // For now, return basic HTML
        return "<html><body><p>Template: " + templateName + "</p></body></html>";
    }




}
