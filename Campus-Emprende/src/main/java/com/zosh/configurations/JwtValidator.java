package com.zosh.configurations;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.List;

// 🔐 Filtro que se ejecuta en cada request para validar el JWT
public class JwtValidator extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, 
	HttpServletResponse response,
	FilterChain filterChain) throws ServletException, IOException {

        // 📥 Obtiene el token desde el header Authorization
		String jwt = request.getHeader(JwtConstant.JWT_HEADER);

        // Si existe token, intenta validarlo
		if(jwt!=null){

            // Elimina "Bearer "
			jwt=jwt.substring(7);

			try{
                // 🔐 Genera la clave secreta para validar el token
				SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());

                // 📦 Parsea el token y obtiene los datos (claims)
				Claims claims = Jwts.parser().verifyWith(key).build()
						.parseSignedClaims(jwt).getPayload();

                // 📌 Extrae información del token
				String email = String.valueOf(claims.get("email"));
				String authorities = String.valueOf(claims.get("authorities"));

                // 🔄 Convierte roles a lista de permisos
				List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList(authorities);

                // 👤 Crea objeto de autenticación
				Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, auths);

                // 📌 Guarda usuario autenticado en el contexto de Spring Security
				SecurityContextHolder.getContext().setAuthentication(authentication);

			}catch (Exception e){

                // ❌ Si el token es inválido o expiró
				throw new BadCredentialsException("Token no válido....");
			}
		}

        // 🔁 Continúa con la cadena de filtros (muy importante)
		filterChain.doFilter(request, response);
	}

}