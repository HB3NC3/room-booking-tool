package hu.aut.szarch.User.Presentation;

import hu.aut.szarch.User.Entity.SystemUserEntity;
import hu.aut.szarch.User.Presentation.Response.SystemUserResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SystemUserResponseMapper {

    public SystemUserResponse map(SystemUserEntity entity) {
        return new SystemUserResponse(entity.getUsername(), entity.getRole(), entity.getId());
    }

    public List<SystemUserResponse> mapList(List<SystemUserEntity> all) {
        return all.stream().map(u -> new SystemUserResponse(u.getUsername(), u.getRole(), u.getId())).collect(Collectors.toList());
    }
}
