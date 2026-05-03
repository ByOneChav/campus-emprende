package com.zosh.oauth2;

import com.zosh.domain.AuthProvider;
import com.zosh.domain.UserRole;
import com.zosh.model.User;
import com.zosh.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

// Servicio personalizado para manejar autenticación OAuth2 (Google)
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    // Repositorio para acceder a los usuarios en base de datos
    @Autowired
    private UserRepository userRepository;

    // Carga el usuario desde el proveedor OAuth2
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // Procesa la información del usuario OAuth2
        return processOAuth2User(userRequest, oauth2User);
    }

    // Procesa los datos del usuario obtenidos desde Google
    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        // Extrae atributos del usuario
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");
        String googleId = (String) attributes.get("sub");

        // Busca usuario por email
        User user = userRepository.findByEmail(email);

        if (user == null) {
            // Crea nuevo usuario si no existe
            user = createNewUser(email, name, picture, googleId);
        } else {
            // Actualiza usuario existente
            user = updateExistingUser(user, name, picture, googleId);
        }

        // Retorna principal personalizado para Spring Security
        return new OAuth2UserPrincipal(user, oauth2User.getAttributes());
    }

    // Crea un nuevo usuario autenticado con Google
    private User createNewUser(String email, String name, String picture, String googleId) {
        User user = new User();
        user.setEmail(email);
        user.setFullName(name);
        user.setProfileImage(picture);
        user.setGoogleId(googleId);
        user.setAuthProvider(AuthProvider.GOOGLE);
        user.setRole(UserRole.ROLE_STUDENT);
        user.setVerified(true); // Usuario verificado automáticamente por Google
        user.setLastLogin(LocalDateTime.now());

        return userRepository.save(user);
    }

    // Actualiza información de un usuario existente
    private User updateExistingUser(User user, String name, String picture, String googleId) {
        // Si era usuario local, se vincula con Google
        if (user.getAuthProvider() == AuthProvider.LOCAL) {
            user.setAuthProvider(AuthProvider.GOOGLE);
        }

        // Actualiza datos del usuario
        user.setGoogleId(googleId);
        user.setProfileImage(picture);
        user.setFullName(name);
        user.setVerified(true);
        user.setLastLogin(LocalDateTime.now());

        return userRepository.save(user);
    }
}