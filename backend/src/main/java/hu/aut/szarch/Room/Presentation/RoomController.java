package hu.aut.szarch.Room.Presentation;

import hu.aut.szarch.Room.Presentation.Request.RoomCreateRequest;
import hu.aut.szarch.Room.Presentation.Request.RoomUpdateRequest;
import hu.aut.szarch.Room.Presentation.Response.RoomResponse;
import hu.aut.szarch.Room.Service.RoomService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/room")
public class RoomController {

    private RoomService roomService;

    private RoomMapper mapper;

    public RoomController(RoomService roomService, RoomMapper mapper) {
        this.roomService = roomService;
        this.mapper = mapper;
    }

    //create, update, delete, list

    @GetMapping
    public List<RoomResponse> getAllRooms() {
        return mapper.mapList(roomService.getAllRooms());
    }

    @PostMapping
    public RoomResponse createRoom(@RequestBody @Valid RoomCreateRequest roomCreateRequest) {
        return mapper.map(roomService.createRoom(roomCreateRequest));
    }

    @PutMapping("/{id}")
    public RoomResponse modifyRoom(@PathVariable UUID id, @RequestBody @Valid RoomUpdateRequest roomUpdateRequest) {
        return mapper.map(roomService.modifyRoom(id, roomUpdateRequest));
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
    }

}
