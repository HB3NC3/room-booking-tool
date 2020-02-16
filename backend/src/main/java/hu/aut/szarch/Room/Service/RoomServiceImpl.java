package hu.aut.szarch.Room.Service;

import hu.aut.szarch.Authentication.Service.AuthenticationService;
import hu.aut.szarch.Event.Service.EventRepository;
import hu.aut.szarch.Room.Entity.RoomEntity;
import hu.aut.szarch.Room.Presentation.Request.RoomCreateRequest;
import hu.aut.szarch.Room.Presentation.Request.RoomUpdateRequest;
import hu.aut.szarch.User.Entity.Role;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class RoomServiceImpl implements RoomService {

    private AuthenticationService authenticationService;

    private RoomRepository roomRepository;

    private EventRepository eventRepository;

    public RoomServiceImpl(AuthenticationService authenticationService, RoomRepository roomRepository, EventRepository eventRepository) {
        this.authenticationService = authenticationService;
        this.roomRepository = roomRepository;
        this.eventRepository = eventRepository;
    }

    @Override
    public List<RoomEntity> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public RoomEntity createRoom(RoomCreateRequest request) {
        isAdmin();
        if (roomRepository.existsByName(request.getName())) {
            throw new ValidationException("Létezik már ilyen szoba");
        }
        RoomEntity entity = new RoomEntity();
        entity.setName(request.getName());
        entity.setLocation(request.getLocation());
        return roomRepository.save(entity);
    }

    @Override
    public RoomEntity modifyRoom(UUID id, RoomUpdateRequest request) {
        isAdmin();
        RoomEntity entity = roomRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Nem létezik terem az adott ID-val"));
        if (roomRepository.existsByName(request.getName()) && id != entity.getId()) {
            throw new ValidationException("Létezik már ilyen szoba");
        }
        entity.setLocation(request.getLocation());
        entity.setName(request.getName());
        return roomRepository.save(entity);
    }

    private void isAdmin() {
        if (!authenticationService.getRole().equals(Role.ADMIN)) {
            throw new ValidationException("Jogtalan hozzáférés");
        }
    }

    @Override
    public void deleteRoom(UUID id) {
        isAdmin();
        RoomEntity entity = roomRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Nincs ilyen terem"));
        if (eventRepository.findAll().stream().anyMatch(e -> e.getRooms().stream().anyMatch(r -> r.getId().equals(entity.getId()))))
        {
            throw new ValidationException("A szobához van event rendelve");
        }
        roomRepository.deleteById(id);
    }
}
