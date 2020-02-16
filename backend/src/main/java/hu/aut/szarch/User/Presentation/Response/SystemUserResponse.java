package hu.aut.szarch.User.Presentation.Response;

import hu.aut.szarch.User.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemUserResponse implements Serializable {

    String username;

    Role role;

    UUID id;

}
