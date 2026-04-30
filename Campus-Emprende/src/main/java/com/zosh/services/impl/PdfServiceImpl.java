package com.zosh.services.impl;

import com.zosh.exception.UserException;
import com.zosh.modal.Profile;
import com.zosh.modal.User;
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

@Service
@RequiredArgsConstructor
public class PdfServiceImpl implements PdfService {

    private final UserService userService;
    private final ProfileRepository profileRepository;

    @Override
    public byte[] generateProfilePdf() throws UserException, IOException {
        User currentUser = userService.getCurrentUser();
        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new UserException("Perfil no encontrado. Por favor, cree uno antes de exportar."));

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDType1Font fontBold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font fontRegular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                float margin = 50;
                float yStart = PDRectangle.A4.getHeight() - margin;
                float leading = 20f;
                float y = yStart;

                // Title
                content.beginText();
                content.setFont(fontBold, 22);
                content.newLineAtOffset(margin, y);
                content.showText("Campus Emprende — Portfolio");
                content.endText();
                y -= leading * 2;

                // Name
                content.beginText();
                content.setFont(fontBold, 16);
                content.newLineAtOffset(margin, y);
                content.showText(currentUser.getFullName());
                content.endText();
                y -= leading;

                // Email
                content.beginText();
                content.setFont(fontRegular, 12);
                content.newLineAtOffset(margin, y);
                content.showText("Email: " + currentUser.getEmail());
                content.endText();
                y -= leading;

                // Career
                if (profile.getCareer() != null) {
                    content.beginText();
                    content.setFont(fontRegular, 12);
                    content.newLineAtOffset(margin, y);
                    content.showText("Career: " + profile.getCareer());
                    content.endText();
                    y -= leading;
                }

                // LinkedIn
                if (profile.getLinkedinUrl() != null) {
                    content.beginText();
                    content.setFont(fontRegular, 12);
                    content.newLineAtOffset(margin, y);
                    content.showText("LinkedIn: " + profile.getLinkedinUrl());
                    content.endText();
                    y -= leading;
                }

                y -= leading;

                // Bio header
                content.beginText();
                content.setFont(fontBold, 13);
                content.newLineAtOffset(margin, y);
                content.showText("Acerca de mí");
                content.endText();
                y -= leading;

                // Bio text (simple, single block)
                if (profile.getBio() != null && !profile.getBio().isBlank()) {
                    float pageWidth = PDRectangle.A4.getWidth() - 2 * margin;
                    String bio = profile.getBio();
                    // wrap bio into lines of ~90 chars
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
                    if (!line.toString().isBlank()) {
                        content.beginText();
                        content.setFont(fontRegular, 11);
                        content.newLineAtOffset(margin, y);
                        content.showText(line.toString().trim());
                        content.endText();
                    }
                }
            }

            document.save(out);
            return out.toByteArray();
        }
    }
}
