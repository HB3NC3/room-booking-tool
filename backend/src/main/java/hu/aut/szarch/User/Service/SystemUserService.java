package hu.aut.szarch.User.Service;

import hu.aut.szarch.User.Entity.SystemUserEntity;
import hu.aut.szarch.User.Presentation.Request.LoginCredentials;
import hu.aut.szarch.User.Presentation.Request.SystemUserRegisterRequest;
import hu.aut.szarch.User.Presentation.Request.SystemUserRoleModificationRequest;
import hu.aut.szarch.User.Presentation.Response.UserLoginResponse;

import java.util.List;

public interface SystemUserService {
    SystemUserEntity register(SystemUserRegisterRequest registerRequest);

    SystemUserEntity modifyRole(SystemUserRoleModificationRequest registerRequest);

    UserLoginResponse logIn(LoginCredentials request);

    List<SystemUserEntity> getAll();
}
