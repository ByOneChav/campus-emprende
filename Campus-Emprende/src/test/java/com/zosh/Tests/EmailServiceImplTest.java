package com.zosh.Tests;

import com.zosh.payload.response.EmailNotificationDTO;
import com.zosh.services.impl.EmailServiceImpl;
import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para EmailServiceImpl
// Como este servicio construye un MimeMessage real con MimeMessageHelper,
// hacemos que javaMailSender.createMimeMessage() devuelva un MimeMessage
// "de verdad" (creado en memoria con una Session) y luego inspeccionamos
// su contenido (asunto, destinatario, cuerpo) para validar el resultado.
@ExtendWith(MockitoExtension.class)
class EmailServiceImplTest {

    // 📧 Cliente SMTP de Spring (mockeado, no envía correos reales)
    @Mock
    private JavaMailSender javaMailSender;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private EmailServiceImpl emailService;

    // =====================================================
    // 🧱 Helpers
    // =====================================================

    // 📨 Crea un MimeMessage real "vacío" usando una sesión en memoria
    private MimeMessage newMimeMessage() {
        return new MimeMessage(Session.getDefaultInstance(new Properties()));
    }

    // 📖 Extrae el contenido (cuerpo) del MimeMessage como texto
    private String getBody(MimeMessage message) throws Exception {
        Object content = message.getContent();
        return content != null ? content.toString() : "";
    }

    // =====================================================
    // ✉️ sendEmail(to, subject, body) — Envío básico
    // =====================================================

    // 🧪 Construye y envía correctamente el correo con asunto, destinatario y cuerpo HTML
    @Test
    void sendEmail_basic_success() throws Exception {
        MimeMessage mimeMessage = newMimeMessage();
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendEmail("test@mail.com", "Bienvenido", "<p>Hola mundo</p>");

        // 🔍 Se envió el mensaje a través del javaMailSender
        verify(javaMailSender).send(mimeMessage);

        // ✅ Asunto correcto
        assertEquals("Bienvenido", mimeMessage.getSubject());

        // ✅ Destinatario correcto
        assertEquals(1, mimeMessage.getRecipients(Message.RecipientType.TO).length);
        assertEquals("test@mail.com", mimeMessage.getRecipients(Message.RecipientType.TO)[0].toString());

        // ✅ Cuerpo correcto (HTML)
        assertTrue(getBody(mimeMessage).contains("Hola mundo"));
    }

    // 🧪 Si javaMailSender.send(...) falla, traduce el error a MailSendException
    @Test
    void sendEmail_basic_throwsMailSendExceptionOnFailure() {
        MimeMessage mimeMessage = newMimeMessage();
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);

        // 💥 Simula una falla del servidor SMTP
        doThrow(new MailSendException("Error de conexión SMTP"))
                .when(javaMailSender).send(any(MimeMessage.class));

        assertThrows(MailSendException.class,
                () -> emailService.sendEmail("test@mail.com", "Asunto", "Cuerpo"));
    }

    // =====================================================
    // 📦 sendEmail(EmailNotificationDTO) — Envío simple desde DTO
    // =====================================================

    // 🧪 Usa el valor de "message" en templateData como cuerpo del correo
    @Test
    void sendEmail_fromDto_usesMessageFromTemplateData() throws Exception {
        MimeMessage mimeMessage = newMimeMessage();
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);

        Map<String, Object> templateData = new HashMap<>();
        templateData.put("message", "Tu solicitud fue aceptada");

        EmailNotificationDTO notification = new EmailNotificationDTO();
        notification.setRecipient("test@mail.com");
        notification.setSubject("Actualización de solicitud");
        notification.setTemplateData(templateData);

        emailService.sendEmail(notification);

        verify(javaMailSender).send(mimeMessage);
        assertEquals("Actualización de solicitud", mimeMessage.getSubject());
        assertEquals("test@mail.com", mimeMessage.getRecipients(Message.RecipientType.TO)[0].toString());
        assertTrue(getBody(mimeMessage).contains("Tu solicitud fue aceptada"));
    }

    // 🧪 Si templateData no tiene la clave "message", el cuerpo queda vacío (fallback)
    @Test
    void sendEmail_fromDto_emptyBodyWhenNoMessageKey() throws Exception {
        MimeMessage mimeMessage = newMimeMessage();
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);

        EmailNotificationDTO notification = new EmailNotificationDTO();
        notification.setRecipient("test@mail.com");
        notification.setSubject("Sin mensaje");
        notification.setTemplateData(null); // 🚫 sin datos de plantilla

        emailService.sendEmail(notification);

        verify(javaMailSender).send(mimeMessage);
        assertEquals("", getBody(mimeMessage));
    }

    // =====================================================
    // 🎨 sendTemplatedEmail(EmailNotificationDTO) — Envío con plantilla HTML
    // =====================================================

    // 🧪 Genera un cuerpo HTML que incluye el nombre de la plantilla
    @Test
    void sendTemplatedEmail_buildsHtmlBodyWithTemplateName() throws Exception {
        MimeMessage mimeMessage = newMimeMessage();
        when(javaMailSender.createMimeMessage()).thenReturn(mimeMessage);

        EmailNotificationDTO notification = new EmailNotificationDTO();
        notification.setRecipient("test@mail.com");
        notification.setSubject("Notificación con plantilla");
        notification.setTemplateName("welcome-template");

        emailService.sendTemplatedEmail(notification);

        verify(javaMailSender).send(mimeMessage);
        assertEquals("Notificación con plantilla", mimeMessage.getSubject());

        String body = getBody(mimeMessage);
        assertTrue(body.contains("<html>"));
        assertTrue(body.contains("Template: welcome-template"));
    }
}