package hu.aut.szarch.Authentication.Service.Token;

import hu.aut.szarch.Authentication.Service.AuthenticatedUser;
import hu.aut.szarch.Authentication.Service.JwtEncryptor;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.GenericFilterBean;

import javax.persistence.EntityNotFoundException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtFilter extends GenericFilterBean {
    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);
    private JwtEncryptor jwtEncryptor;
    private String jwtSecret;

    public JwtFilter(JwtEncryptor jwtEncryptor, String jwtSecret) {
        this.jwtEncryptor = jwtEncryptor;
        this.jwtSecret = jwtSecret;
    }

    public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String encryptedToken = authHeader.substring(7);

            try {
                Jwts.parser().setSigningKey(this.jwtSecret.getBytes()).parseClaimsJws(this.jwtEncryptor.decrypt(encryptedToken)).getBody();
                SecurityContextHolder.getContext().setAuthentication(new AuthenticatedUser(encryptedToken));
                chain.doFilter(req, res);
                SecurityContextHolder.getContext().setAuthentication((Authentication) null);
            } catch (ExpiredJwtException var9) {
                ((HttpServletResponse) res).sendError(401);
            } catch (MalformedJwtException var10) {
                ((HttpServletResponse) res).sendError(400);
            } catch (SignatureException var11) {
                ((HttpServletResponse) res).sendError(403);
            }
        } else {
            try {
                chain.doFilter(req, res);
            } catch (EntityNotFoundException var8) {
                this.error(res, "Auth error");
            }

            SecurityContextHolder.getContext().setAuthentication((Authentication) null);
        }

    }

    private void error(ServletResponse res, String msg) throws IOException, ServletException {
        if (res instanceof HttpServletResponse) {
            ((HttpServletResponse) res).sendError(401, msg);
        } else {
            throw new ServletException(msg);
        }
    }
}