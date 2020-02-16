package hu.aut.szarch.Event.Service;

import hu.aut.szarch.Authentication.Service.AuthenticationService;
import hu.aut.szarch.Event.Entity.EventEntity;
import hu.aut.szarch.Event.Presentation.Request.EventCreationRequest;
import hu.aut.szarch.Event.Presentation.Request.EventIntervalRequest;
import hu.aut.szarch.Event.Presentation.Request.EventUpdateRequest;
import hu.aut.szarch.Room.Entity.RoomEntity;
import hu.aut.szarch.Room.Service.RoomRepository;
import hu.aut.szarch.User.Entity.Role;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventServiceImpl implements EventService {

    private EventRepository eventRepository;

    private RoomRepository roomRepository;

    private AuthenticationService authenticationService;

    public EventServiceImpl(EventRepository eventRepository, RoomRepository roomRepository, AuthenticationService authenticationService) {
        this.eventRepository = eventRepository;
        this.roomRepository = roomRepository;
        this.authenticationService = authenticationService;
    }

    @Override
    public List<EventEntity> getAllEvents() {
        Role userRole = authenticationService.getRole();
        if (userRole.equals(Role.REGISTERED) || userRole.equals(Role.ADMIN)) {
            return eventRepository.findAll();
        } else {
            return eventRepository.findByIsPrivateIsFalse();
        }
    }

    @Override
    public List<EventEntity> findAllInInterval(EventIntervalRequest intervalRequest) {
        Role userRole = authenticationService.getRole();
        if(userRole == null ){
            return eventRepository.findByStartDateIsBetweenAndIsPrivateIsFalse(intervalRequest.getStartDate(), intervalRequest.getEndDate());
        }
        else if (userRole.equals(Role.REGISTERED) || userRole.equals(Role.ADMIN)) {
            return eventRepository.findByStartDateIsBetween(intervalRequest.getStartDate(), intervalRequest.getEndDate());
        } else {
            return eventRepository.findByStartDateIsBetweenAndIsPrivateIsFalse(intervalRequest.getStartDate(), intervalRequest.getEndDate());

        }
    }

    @Override
    public EventEntity createEvent(EventCreationRequest eventCreateRequest) {
        Role userRole = authenticationService.getRole();
        if(!userRole.equals(Role.REGISTERED) && !userRole.equals(Role.ADMIN)){
            throw new ValidationException("Jogtalan hozzáférés");
        }
        if(eventCreateRequest.getEndDate().isBefore(eventCreateRequest.getStartDate())){
            throw new ValidationException("A kezdés dátuma nem lehet a vége dátuma után");
        }
        if (!roomIsTaken(eventCreateRequest.getStartDate(), eventCreateRequest.getEndDate(), eventCreateRequest.getRoomIds()).isEmpty()) {
            throw new ValidationException("A szoba már foglalt erre az időpontra");
        } else {
            EventEntity entity = new EventEntity();
            entity.setCreator(authenticationService.getUser());
            entity.setIsPrivate(eventCreateRequest.getIsPrivate());
            entity.setEndDate(eventCreateRequest.getEndDate());
            entity.setStartDate(eventCreateRequest.getStartDate());
            entity.setRooms(new ArrayList<>());
            for (UUID id : eventCreateRequest.getRoomIds()) {
                Optional<RoomEntity> tmp = roomRepository.findById(id);
                tmp.ifPresent(roomEntity -> entity.getRooms().add(roomEntity));
            }
            entity.setName(eventCreateRequest.getName());
            entity.setDescription(eventCreateRequest.getDescription());
            return eventRepository.save(entity);
        }
    }

    private List<EventEntity> roomIsTaken(Instant startDate, Instant endDate, List<UUID> roomId) {
        List<EventEntity> response = new ArrayList<>();
        List<EventEntity> byStartDateIsBetween = eventRepository.findByStartDateIsBetween(startDate, endDate);
        if(!byStartDateIsBetween.isEmpty()){
            for( EventEntity event : byStartDateIsBetween){
                List<RoomEntity> collect = event.getRooms().stream().filter(r -> roomId.contains(r.getId())).collect(Collectors.toList());
                if (!collect.isEmpty()){
                    response.add(event);
                }
            }
            return response;
        }
        return response;
    }

    @Override
    public EventEntity modifyEvent(UUID id, EventUpdateRequest eventUpdateRequest) {
        Role userRole = authenticationService.getRole();
        if(!userRole.equals(Role.REGISTERED) && !userRole.equals(Role.ADMIN)){
            throw new ValidationException("Jogtalan hozzáférés");
        }
        if(eventUpdateRequest.getEndDate().isBefore(eventUpdateRequest.getStartDate())){
            throw new ValidationException("A kezdés dátuma nem lehet a vége dátuma után");
        }
        EventEntity existing = eventRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Nem található event ezzel az ID-val"));
        List<EventEntity> roomTaken = roomIsTaken(eventUpdateRequest.getStartDate(), eventUpdateRequest.getEndDate(), eventUpdateRequest.getRoomIds());
        if(!roomTaken.isEmpty() && roomTaken.stream().noneMatch(a -> a.getId() == id)){
            throw new ValidationException("A szoba már foglalt erre az időpontra");
        }else {
            existing.setStartDate(eventUpdateRequest.getStartDate());
            existing.setEndDate(eventUpdateRequest.getEndDate());
            existing.setRooms(new ArrayList<>());
            for (UUID ids : eventUpdateRequest.getRoomIds()) {
                Optional<RoomEntity> tmp = roomRepository.findById(ids);
                tmp.ifPresent(roomEntity -> existing.getRooms().add(roomEntity));
            }
            existing.setIsPrivate(eventUpdateRequest.getIsPrivate());
            existing.setCreator(authenticationService.getUser());
            existing.setName(eventUpdateRequest.getName());
            existing.setDescription(eventUpdateRequest.getDescription());
            return eventRepository.save(existing);
        }
    }

    @Override
    public void deleteEvent(UUID id) {
        Role userRole = authenticationService.getRole();
        if(!userRole.equals(Role.REGISTERED) && !userRole.equals(Role.ADMIN)){
            throw new ValidationException("Jogtalan hozzáférés");
        }
        eventRepository.deleteById(id);
    }

    @Override
    public EventEntity findById(UUID id) {
        Role userRole = authenticationService.getRole();
        if(!userRole.equals(Role.REGISTERED) && !userRole.equals(Role.ADMIN)){
            throw new ValidationException("Jogtalan hozzáférés");
        }
        return eventRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Nincs ilyen ID-val event"));
    }

    @Override
    public List<EventEntity> findAllInIntervalById(UUID id, EventIntervalRequest intervalRequest) {
        return findAllInInterval(intervalRequest).stream().filter(e -> e.getRooms().stream().anyMatch(r->r.getId().equals(id))).collect(Collectors.toList());
    }
}
