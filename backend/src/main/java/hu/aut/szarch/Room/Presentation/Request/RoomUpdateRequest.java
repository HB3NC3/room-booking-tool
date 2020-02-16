package hu.aut.szarch.Room.Presentation.Request;

import lombok.*;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomUpdateRequest implements Serializable {

    @NonNull
    @NotEmpty
    private String name;

    @NonNull
    @NotEmpty
    private String location;

}
