package hu.aut.szarch.Room.Service;

import hu.aut.szarch.Room.Entity.RoomEntity;
import hu.aut.szarch.Room.Presentation.Request.RoomCreateRequest;
import hu.aut.szarch.Room.Presentation.Request.RoomUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface RoomService {

    List<RoomEntity> getAllRooms();

    RoomEntity createRoom(RoomCreateRequest request);

    RoomEntity modifyRoom(UUID id, RoomUpdateRequest request);

    void deleteRoom(UUID id);

}
