package hu.aut.szarch.User.Presentation.Request;

import lombok.*;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SystemUserRegisterRequest implements Serializable {

    @NonNull
    @NotEmpty
    private String username;

    @NonNull
    @NotEmpty
    private String password;

}
