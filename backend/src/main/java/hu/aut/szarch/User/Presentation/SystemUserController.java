package hu.aut.szarch.User.Presentation;

import hu.aut.szarch.User.Presentation.Request.LoginCredentials;
import hu.aut.szarch.User.Presentation.Request.SystemUserRegisterRequest;
import hu.aut.szarch.User.Presentation.Request.SystemUserRoleModificationRequest;
import hu.aut.szarch.User.Presentation.Response.SystemUserResponse;
import hu.aut.szarch.User.Presentation.Response.UserLoginResponse;
import hu.aut.szarch.User.Service.SystemUserService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/system-user")
public class SystemUserController {

    private SystemUserService systemUserService;

    private SystemUserResponseMapper mapper;

    public SystemUserController(SystemUserService systemUserService, SystemUserResponseMapper mapper) {
        this.systemUserService = systemUserService;
        this.mapper = mapper;
    }

    @GetMapping("/all")
    public List<SystemUserResponse>getALlSystemUsers(){
        return mapper.mapList(systemUserService.getAll());
    }

    @PostMapping("/register")
    public SystemUserResponse registerSystemUser(@RequestBody SystemUserRegisterRequest registerRequest) {
        return mapper.map(systemUserService.register(registerRequest));
    }

    @PostMapping("/login")
    public UserLoginResponse login(@RequestBody LoginCredentials request){
        return systemUserService.logIn(request);
    }

    @PutMapping
    public SystemUserResponse modifySystemUserRole(@RequestBody @Valid SystemUserRoleModificationRequest registerRequest){
        return mapper.map(systemUserService.modifyRole(registerRequest));
    }

}
