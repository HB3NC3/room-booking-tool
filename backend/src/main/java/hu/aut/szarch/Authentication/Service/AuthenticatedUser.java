package hu.aut.szarch.Authentication.Service;

import hu.aut.szarch.User.Entity.SystemUserEntity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Getter
@Setter
public class AuthenticatedUser implements Authentication {

    private String encryptedToken;

    private String globalToken;

    private SystemUserEntity userEntity;

    private List<GrantedAuthority> authorities;

    private boolean authenticated;

    public AuthenticatedUser(SystemUserEntity userEntity, Boolean authenticated) {
        this.userEntity = userEntity;
        this.authenticated = authenticated;
    }

    public AuthenticatedUser(String encryptedToken) {
        this.authenticated = false;
        this.encryptedToken = encryptedToken;
        this.setAuthenticated(false);
    }

    @Override
    public Object getCredentials() {
        return encryptedToken;
    }

    @Override
    public Object getDetails() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return userEntity;
    }

    @Override
    public String getName() {
        if(userEntity!= null){
            return userEntity.getUsername();
        }else {
            return "";
        }
    }
}
