package com.zosh.services;

import com.zosh.exception.UserException;

import java.io.IOException;

public interface PdfService {
    byte[] generateProfilePdf() throws UserException, IOException;
}
