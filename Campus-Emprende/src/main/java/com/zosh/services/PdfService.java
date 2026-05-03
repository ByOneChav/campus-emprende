package com.zosh.services;

import com.zosh.exception.UserException;

import java.io.IOException;

// Interfaz que define el contrato para la generación de PDFs del sistema
public interface PdfService {
    
    // Método que genera un PDF del perfil del usuario y lo retorna como arreglo de bytes
    byte[] generateProfilePdf() throws UserException, IOException;
}