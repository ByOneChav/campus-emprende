package com.zosh.configurations;

// Clase que almacena constantes relacionadas con JWT
public class JwtConstant {
 
	// Clave secreta utilizada para firmar y validar los tokens JWT
	public static final String SECRET_KEY = "asdfghjklpoiuytrewqzxcvbnmlkjhglpouhggfdsawqwertyyuiioplmnbvcxzasdfgh";
	
	// Nombre del header HTTP donde se envía el token JWT
	public static final String JWT_HEADER = "Authorization";
}
