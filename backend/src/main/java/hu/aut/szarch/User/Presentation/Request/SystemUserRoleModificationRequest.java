package hu.aut.szarch.User.Presentation.Request;

import hu.aut.szarch.User.Entity.Role;
import lombok.*;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemUserRoleModificationRequest implements Serializable {

    @NonNull
    @NotEmpty
    private String username;

    @NonNull
    private Role desiredRole;

}
