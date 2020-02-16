package hu.aut.szarch.Room.Presentation;

import hu.aut.szarch.Room.Entity.RoomEntity;
import hu.aut.szarch.Room.Presentation.Response.RoomResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomMapper {
    public RoomResponse map(RoomEntity room) {
        return new RoomResponse(room.getId(), room.getName(), room.getLocation());
    }

    public List<RoomResponse> mapList(List<RoomEntity> allRooms) {
        return allRooms.stream().map(a -> new RoomResponse(a.getId(), a.getName(), a.getLocation())).collect(Collectors.toList());
    }
}
