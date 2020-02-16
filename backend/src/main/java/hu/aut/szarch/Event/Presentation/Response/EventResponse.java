package hu.aut.szarch.Event.Presentation.Response;

import hu.aut.szarch.Room.Presentation.Response.RoomResponse;
import hu.aut.szarch.User.Presentation.Response.SystemUserResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse implements Serializable {

    private List<RoomResponse> roomList;

    private Instant startDate;

    private Instant endDate;

    private Boolean isPrivate;

    private SystemUserResponse creator;

    private UUID id;

    private String name;

    private String description;

}
