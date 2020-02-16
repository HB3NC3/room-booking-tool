package hu.aut.szarch.Authentication.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import hu.aut.szarch.User.Entity.Role;
import hu.aut.szarch.User.Entity.SystemUserEntity;
import hu.aut.szarch.User.Presentation.Request.LoginCredentials;
import hu.aut.szarch.User.Service.SystemUserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.JacksonDeserializer;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.validation.ValidationException;
import java.sql.Date;
import java.time.Instant;
import java.util.Optional;

@Service
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService, AuthenticationProvider {

    @Value("${aut.security.jwt.signing-key}")
    private String signingKey;

    private JwtEncryptor jwtEncryptor;

    private SystemUserRepository userRepository;

    private ObjectMapper objectMapper;

    private BCryptPasswordEncoder passwordEncoder;

    public AuthenticationServiceImpl(JwtEncryptor jwtEncryptor, SystemUserRepository userRepository, ObjectMapper objectMapper, BCryptPasswordEncoder passwordEncoder) {
        this.jwtEncryptor = jwtEncryptor;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.passwordEncoder = passwordEncoder;
    }

    private String getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String currentUserName = authentication.getName();
            return currentUserName;
        }
        return null;
    }

    @Override
    public Role getRole() {
        Authentication rawAuthentication = SecurityContextHolder.getContext().getAuthentication();
        if (rawAuthentication instanceof AuthenticatedUser) {
            AuthenticatedUser authenticatedUser = (AuthenticatedUser) rawAuthentication;
            if (authenticatedUser.getPrincipal() instanceof SystemUserEntity) {
                Optional<SystemUserEntity> principal = Optional.of((SystemUserEntity) authenticatedUser.getPrincipal());
                return principal.get().getRole();
            }
        }
        return null;
    }

    @Override
    public SystemUserEntity getUser() {
        Authentication rawAuthentication = SecurityContextHolder.getContext().getAuthentication();
        if (rawAuthentication instanceof AuthenticatedUser) {
            AuthenticatedUser authenticatedUser = (AuthenticatedUser) rawAuthentication;
            if (authenticatedUser.getPrincipal() instanceof SystemUserEntity) {
                return (SystemUserEntity) authenticatedUser.getPrincipal();
            }
        }
        return null;
    }

    @Override
    public String logInUser(LoginCredentials request) {
        SystemUserEntity entity = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new ValidationException("A megadott jelszó vagy felhasználónév helytelen."));
        if (!passwordEncoder.matches(request.getPassword(), entity.getPassword())) {
            throw new ValidationException("A megadott jelszó vagy felhasználónév helytelen.");
        }
        Instant expirationDate = Instant.now().plusSeconds(86400);
        return jwtEncryptor.encrypt(Jwts.builder()
                .setId(entity.getId().toString())
                .setExpiration(Date.from(expirationDate))
                .claim("Username", entity.getUsername())
                .signWith(Keys.hmacShaKeyFor(signingKey.getBytes()), SignatureAlgorithm.HS256)
                .compact());
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (authentication.isAuthenticated()) {
            return authentication;
        } else {
            final String encryptedToken = authentication.getCredentials().toString();

            try {
                final String token = jwtEncryptor.decrypt(encryptedToken);
                final Claims claims = Jwts.parser()
                        .setSigningKey(signingKey.getBytes())
                        .deserializeJsonWith(new JacksonDeserializer<>(objectMapper))
                        .parseClaimsJws(token)
                        .getBody();
                Optional<SystemUserEntity> byUsername = userRepository.findByUsername((String) claims.get("Username"));
                if (byUsername.isPresent()) {
                    return new AuthenticatedUser(byUsername.get(), true);
                }
            } catch (ExpiredJwtException e) {
                log.trace("Lejárt accessToken {}", encryptedToken);
            } catch (MalformedJwtException e) {
                log.warn("Érvénytelen formátumú accessToken!", e);
            }

            return null;
        }
    }

    @Override
    public boolean supports(Class<?> aClass) {
        return aClass.isAssignableFrom(AuthenticatedUser.class);
    }
}
