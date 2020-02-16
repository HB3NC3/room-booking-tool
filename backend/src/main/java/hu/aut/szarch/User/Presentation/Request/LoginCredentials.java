package hu.aut.szarch.User.Presentation.Request;

import lombok.*;

import javax.validation.constraints.NotEmpty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginCredentials {

    @NonNull
    @NotEmpty
    private String username;

    @NonNull
    @NotEmpty
    private String password;

}
