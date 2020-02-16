package hu.aut.szarch.Room.Presentation.Response;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
public class RoomResponse implements Serializable {

    private UUID id;

    private String name;

    private String location;

    public RoomResponse(UUID id, String name, String location) {
        this.id = id;
        this.name = name;
        this.location = location;
    }
}
