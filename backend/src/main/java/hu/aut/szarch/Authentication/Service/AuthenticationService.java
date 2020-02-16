package hu.aut.szarch.Authentication.Service;

import hu.aut.szarch.User.Entity.Role;
import hu.aut.szarch.User.Entity.SystemUserEntity;
import hu.aut.szarch.User.Presentation.Request.LoginCredentials;

public interface AuthenticationService {
    Role getRole();

    SystemUserEntity getUser();

    String logInUser(LoginCredentials request);
}

