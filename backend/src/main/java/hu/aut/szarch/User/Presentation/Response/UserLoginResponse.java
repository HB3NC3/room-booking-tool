package hu.aut.szarch.User.Presentation.Response;

import hu.aut.szarch.User.Entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLoginResponse implements Serializable {

    String token;

    Role role;

}
