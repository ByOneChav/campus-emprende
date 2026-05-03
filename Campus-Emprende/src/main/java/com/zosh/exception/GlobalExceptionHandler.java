package com.zosh.exception;

// Importa clase de respuesta personalizada para la API
import com.zosh.payload.response.ApiResponse;
// Importaciones de Spring para manejo de respuestas HTTP
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// Importaciones para manejo de validaciones
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
// Importaciones para manejo global de excepciones
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// Clase que maneja globalmente las excepciones en los controladores REST
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Maneja excepciones personalizadas del tipo UserException
    @ExceptionHandler(UserException.class)
    public ResponseEntity<ApiResponse> handleUserException(UserException ex) {
        // Retorna error 400 con mensaje personalizado
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(), false));
    }

    // Maneja errores de validación provenientes de anotaciones @Valid
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        // Mapa para almacenar errores por campo
        Map<String, String> errors = new HashMap<>();

        // Itera sobre los errores de validación y los agrega al mapa
        ex.getBindingResult().getAllErrors().forEach(error -> {
            // Obtiene el nombre del campo con error
            String fieldName = ((FieldError) error).getField();
            // Obtiene el mensaje de error
            String errorMessage = error.getDefaultMessage();
            // Guarda el error en el mapa
            errors.put(fieldName, errorMessage);
        });

        // Crea respuesta con mensaje general y detalles de errores
        ValidationErrorResponse response = new ValidationErrorResponse("La validación falló", errors);
        // Retorna error 400 con detalles de validación
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Maneja excepciones de tipo IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        // Retorna error 400 con mensaje de la excepción
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(), false));
    }

    // Maneja cualquier otra excepción no controlada
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneralException(Exception ex) {
        // Retorna error 500 con mensaje general del sistema
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("Se produjo un error. XD: " + ex.getMessage(), false));
    }

    // Clase interna para estructurar errores de validación
    public static class ValidationErrorResponse {
        // Mensaje general del error
        public String message;
        // Mapa de errores por campo
        public Map<String, String> errors;

        // Constructor de la respuesta de error de validación
        public ValidationErrorResponse(String message, Map<String, String> errors) {
            // Inicializa mensaje
            this.message = message;
            // Inicializa mapa de errores
            this.errors = errors;
        }
    }
}