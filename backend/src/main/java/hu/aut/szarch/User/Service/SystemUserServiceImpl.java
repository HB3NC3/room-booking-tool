package hu.aut.szarch.User.Service;

import hu.aut.szarch.Authentication.Service.AuthenticationService;
import hu.aut.szarch.User.Entity.Role;
import hu.aut.szarch.User.Entity.SystemUserEntity;
import hu.aut.szarch.User.Presentation.Request.LoginCredentials;
import hu.aut.szarch.User.Presentation.Request.SystemUserRegisterRequest;
import hu.aut.szarch.User.Presentation.Request.SystemUserRoleModificationRequest;
import hu.aut.szarch.User.Presentation.Response.UserLoginResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SystemUserServiceImpl implements SystemUserService{

    private BCryptPasswordEncoder passwordEncoder;

    private AuthenticationService authenticationService;

    private SystemUserRepository systemUserRepository;

    public SystemUserServiceImpl(BCryptPasswordEncoder passwordEncoder, AuthenticationService authenticationService, SystemUserRepository systemUserRepository) {
        this.passwordEncoder = passwordEncoder;
        this.authenticationService = authenticationService;
        this.systemUserRepository = systemUserRepository;
    }

    @PostConstruct
    private void injectAdmin(){
        Optional<SystemUserEntity> admin1 = systemUserRepository.findByUsername("admin");
        if(admin1.isEmpty()) {
            SystemUserEntity admin = new SystemUserEntity();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(Role.ADMIN);
            systemUserRepository.save(admin);
        }
    }

    @Override
    public SystemUserEntity register(SystemUserRegisterRequest registerRequest) {
        if(systemUserRepository.existsByUsername(registerRequest.getUsername())){
            throw new ValidationException("Létezik már ilyen felhasználó");
        }
            SystemUserEntity entity = new SystemUserEntity();
            entity.setUsername(registerRequest.getUsername());
            entity.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            entity.setRole(Role.REGISTERED);
            return systemUserRepository.save(entity);
    }

    @Override
    public SystemUserEntity modifyRole(SystemUserRoleModificationRequest registerRequest) {
        SystemUserEntity user = authenticationService.getUser();
        if(user.getRole().equals(Role.ADMIN)) {
            SystemUserEntity entity = systemUserRepository.findByUsername(registerRequest.getUsername()).orElseThrow(() -> new EntityNotFoundException("Ilyen névvel nincs regisztrált felhasználó"));
            entity.setRole(registerRequest.getDesiredRole());
            return systemUserRepository.save(entity);
        }
        throw new ValidationException("Jogtalan hozzáférés");
    }

    @Override
    public UserLoginResponse logIn(LoginCredentials request) {
        return new UserLoginResponse(authenticationService.logInUser(request), systemUserRepository.findByUsername(request.getUsername()).orElseThrow( () -> new EntityNotFoundException("Hibás belépési adatok")).getRole());
    }

    @Override
    public List<SystemUserEntity> getAll() {
        return systemUserRepository.findAll();
    }


}
