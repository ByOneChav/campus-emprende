package com.zosh.Tests;

import com.zosh.exception.UserException;
import com.zosh.model.Profile;
import com.zosh.model.User;
import com.zosh.repository.ProfileRepository;
import com.zosh.services.UserService;
import com.zosh.services.impl.PdfServiceImpl;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para PdfServiceImpl
// Como este servicio genera un PDF real con PDFBox, no usamos mappers:
// generamos el documento de verdad y extraemos su texto (PDFTextStripper)
// para validar que el contenido del usuario/perfil se haya escrito correctamente.
@ExtendWith(MockitoExtension.class)
class PdfServiceImplTest {

    // 🔐 Servicio de usuario (mockeado, simula al usuario autenticado por JWT)
    @Mock
    private UserService userService;

    // 🔗 Repositorio de perfiles (mockeado)
    @Mock
    private ProfileRepository profileRepository;

    // 🧩 Clase real que se está probando (genera el PDF de verdad)
    @InjectMocks
    private PdfServiceImpl pdfService;

    // =====================================================
    // 🧱 Helper para construir usuarios de prueba
    // =====================================================

    private User buildUser(Long id, String fullName, String email) {
        User user = new User();
        user.setId(id);
        user.setFullName(fullName);
        user.setEmail(email);
        return user;
    }

    // =====================================================
    // 📄 generateProfilePdf() — Generar PDF del perfil
    // =====================================================

    // 🧪 Genera el PDF con todos los datos (carrera, linkedin y bio) y verifica el contenido
    @Test
    void generateProfilePdf_success() throws Exception {
        User user = buildUser(1L, "Juan Pérez", "juan@mail.com");

        Profile profile = Profile.builder()
                .user(user)
                .career("Ingeniería de Software")
                .linkedinUrl("http://linkedin.com/in/juanperez")
                .bio("Soy estudiante de ingeniería con experiencia en desarrollo web y móvil.")
                .build();

        when(userService.getCurrentUser()).thenReturn(user);
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        byte[] result = pdfService.generateProfilePdf();

        // ✅ El PDF se generó y no está vacío
        assertNotNull(result);
        assertTrue(result.length > 0);

        // ✅ Verifica que sea realmente un archivo PDF (encabezado %PDF)
        assertEquals("%PDF", new String(result, 0, 4));

        // 📖 Extrae el texto del PDF generado para validar su contenido
        try (PDDocument document = Loader.loadPDF(result)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            assertTrue(text.contains("Juan Pérez"));
            assertTrue(text.contains("juan@mail.com"));
            assertTrue(text.contains("Ingeniería de Software"));
            assertTrue(text.contains("linkedin.com/in/juanperez"));
            assertTrue(text.contains("Acerca de mí"));
        }
    }

    // 🧪 Lanza UserException si el usuario aún no tiene perfil creado
    @Test
    void generateProfilePdf_profileNotFound() throws UserException {
        User user = buildUser(1L, "Juan Pérez", "juan@mail.com");

        when(userService.getCurrentUser()).thenReturn(user);
        when(profileRepository.findByUser(user)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> pdfService.generateProfilePdf());
    }

    // 🧪 Genera el PDF correctamente cuando faltan campos opcionales (carrera, linkedin, bio)
    @Test
    void generateProfilePdf_withoutOptionalFields() throws Exception {
        User user = buildUser(2L, "Ana López", "ana@mail.com");

        // 📌 Perfil sin carrera, sin LinkedIn y sin bio
        Profile profile = Profile.builder()
                .user(user)
                .build();

        when(userService.getCurrentUser()).thenReturn(user);
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        byte[] result = pdfService.generateProfilePdf();

        assertNotNull(result);
        assertTrue(result.length > 0);

        try (PDDocument document = Loader.loadPDF(result)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // ✅ Los datos básicos del usuario siempre aparecen
            assertTrue(text.contains("Ana López"));
            assertTrue(text.contains("ana@mail.com"));

            // 🔍 Las secciones opcionales NO deberían aparecer si los campos son null
            assertFalse(text.contains("Career:"));
            assertFalse(text.contains("LinkedIn:"));
        }
    }

    // 🧪 Genera el PDF correctamente con una bio larga que debe dividirse en varias líneas
    @Test
    void generateProfilePdf_longBioWrapsCorrectly() throws Exception {
        User user = buildUser(3L, "Carlos Ruiz", "carlos@mail.com");

        // 📌 Bio que supera el límite de 90 caracteres por línea usado en el servicio
        String longBio = "Esta es una biografia muy larga que deberia dividirse en varias lineas dentro "
                + "del documento PDF generado, ya que supera el limite de noventa caracteres por linea "
                + "definido en el servicio y debe seguir mostrandose correctamente.";

        Profile profile = Profile.builder()
                .user(user)
                .bio(longBio)
                .build();

        when(userService.getCurrentUser()).thenReturn(user);
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        byte[] result = pdfService.generateProfilePdf();

        assertNotNull(result);
        assertTrue(result.length > 0);

        try (PDDocument document = Loader.loadPDF(result)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);

            // ✅ El contenido de la bio se incluyó en el PDF (sin importar en qué línea cayó)
            assertTrue(text.contains("biografia muy larga"));
            assertTrue(text.contains("Acerca de mí"));
        }
    }
}