package com.zosh.configurations;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class JwtProvider {

    // 🔐 Clave secreta usada para firmar y validar el JWT
    // Se genera a partir de JwtConstant.SECRET_KEY
	static SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

    // 🎟️ Genera un token JWT a partir de la autenticación del usuario
	public String generateToken(Authentication auth){

        // Obtiene roles del usuario
		Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();

        // Convierte roles a String (ej: ROLE_USER,ROLE_ADMIN)
		String roles = populateAuthorities(authorities);

        // Construye el JWT con:
        // - fecha de creación
        // - fecha de expiración (24h)
        // - email
        // - roles
        // - firma con clave secreta
        return Jwts.builder().issuedAt(new Date())
				.expiration(new Date(new Date().getTime() + 86400000))
				.claim("email",auth.getName())
				.claim("authorities",roles)
				.signWith(key)
				.compact();
	}

    // 📥 Extrae el email desde el token JWT
	public String getEmailFromJwtToken(String jwt){

        // Elimina "Bearer " del header
		jwt = jwt.substring(7);

        // Parsea el token y obtiene los claims
		Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(jwt).getPayload();

        // Extrae el email
		String email = String.valueOf(claims.get("email"));
		return email;
	}

    // 🔄 Convierte lista de roles a String separado por comas
	private String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {

        // Set para evitar duplicados
		Set<String> auths = new HashSet<>();

        // Recorre roles y los agrega al set
		for(GrantedAuthority authority : authorities){
			auths.add(authority.getAuthority());
		}

        // Une roles en formato: ROLE_USER,ROLE_ADMIN
		return String.join(",",auths);
	}
}