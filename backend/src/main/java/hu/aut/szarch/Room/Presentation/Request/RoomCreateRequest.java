package hu.aut.szarch.Room.Presentation.Request;

import lombok.*;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomCreateRequest implements Serializable {


    @NonNull
    @NotEmpty
    private String name;

    @NonNull
    @NotEmpty
    private String location;


}
