package com.zosh.exception;

// Excepción personalizada para manejar errores relacionados con usuarios
public class UserException extends Exception {
	
	// Constructor que recibe el mensaje de error
	public UserException(String message) {
		// Llama al constructor de la clase padre (Exception)
		super(message);
	}
}