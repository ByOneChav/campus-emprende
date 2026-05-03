package com.zosh.services.impl;

import com.zosh.exception.UserException;
import com.zosh.model.Profile;
import com.zosh.model.User;
import com.zosh.repository.ProfileRepository;
import com.zosh.services.PdfService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

// Servicio encargado de generar un PDF con la información del perfil del usuario
@Service
@RequiredArgsConstructor
public class PdfServiceImpl implements PdfService {

    // Servicio para obtener el usuario autenticado
    private final UserService userService;

    // Repositorio para obtener el perfil del usuario
    private final ProfileRepository profileRepository;

    // Genera el PDF del perfil del usuario actual
    @Override
    public byte[] generateProfilePdf() throws UserException, IOException {

        // Obtiene el usuario autenticado
        User currentUser = userService.getCurrentUser();

        // Obtiene el perfil asociado al usuario
        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new UserException("Perfil no encontrado. Por favor, cree uno antes de exportar."));

        // Crea documento PDF y flujo de salida en memoria
        try (PDDocument document = new PDDocument();
                ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Crea una página tamaño A4
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            // Define fuentes para el documento
            PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            // Crea el flujo de contenido para escribir en el PDF
            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float margin = 50;
                float yStart = PDRectangle.A4.getHeight() - margin;
                float leading = 20f;
                float y = yStart;

                // Título del documento
                content.beginText();
                content.setFont(fontBold, 22);
                content.newLineAtOffset(margin, y);
                content.showText("Campus Emprende — Portafolio 2026");
                content.endText();
                y -= leading * 2;

                // Nombre del usuario
                content.beginText();
                content.setFont(fontBold, 16);
                content.newLineAtOffset(margin, y);
                content.showText(currentUser.getFullName());
                content.endText();
                y -= leading;

                // Email del usuario
                content.beginText();
                content.setFont(fontRegular, 12);
                content.newLineAtOffset(margin, y);
                content.showText("Email: " + currentUser.getEmail());
                content.endText();
                y -= leading;

                // Carrera del usuario (si existe)
                if (profile.getCareer() != null) {
                    content.beginText();
                    content.setFont(fontRegular, 12);
                    content.newLineAtOffset(margin, y);
                    content.showText("Career: " + profile.getCareer());
                    content.endText();
                    y -= leading;
                }

                // LinkedIn del usuario (si existe)
                if (profile.getLinkedinUrl() != null) {
                    content.beginText();
                    content.setFont(fontRegular, 12);
                    content.newLineAtOffset(margin, y);
                    content.showText("LinkedIn: " + profile.getLinkedinUrl());
                    content.endText();
                    y -= leading;
                }

                y -= leading;

                // Encabezado de la sección de biografía
                content.beginText();
                content.setFont(fontBold, 13);
                content.newLineAtOffset(margin, y);
                content.showText("Acerca de mí");
                content.endText();
                y -= leading;

                // Genera el texto de la biografía con salto de líneas
                if (profile.getBio() != null && !profile.getBio().isBlank()) {
                    float pageWidth = PDRectangle.A4.getWidth() - 2 * margin;
                    String bio = profile.getBio();

                    // Divide el texto en palabras para manejar el salto de línea
                    String[] words = bio.split(" ");
                    StringBuilder line = new StringBuilder();
                    for (String word : words) {
                        if (line.length() + word.length() + 1 > 90) {
                            content.beginText();
                            content.setFont(fontRegular, 11);
                            content.newLineAtOffset(margin, y);
                            content.showText(line.toString().trim());
                            content.endText();
                            y -= leading;
                            line = new StringBuilder();
                        }
                        line.append(word).append(" ");
                    }

                    // Escribe la última línea restante
                    if (!line.toString().isBlank()) {
                        content.beginText();
                        content.setFont(fontRegular, 11);
                        content.newLineAtOffset(margin, y);
                        content.showText(line.toString().trim());
                        content.endText();
                    }
                }
            }

            // Guarda el documento en memoria
            document.save(out);

            // Retorna el PDF en formato byte[]
            return out.toByteArray();
        }
    }
}