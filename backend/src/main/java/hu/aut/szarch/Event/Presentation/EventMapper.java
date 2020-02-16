package hu.aut.szarch.Event.Presentation;

import hu.aut.szarch.Event.Entity.EventEntity;
import hu.aut.szarch.Event.Presentation.Response.EventResponse;
import hu.aut.szarch.Room.Presentation.Response.RoomResponse;
import hu.aut.szarch.User.Presentation.Response.SystemUserResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventMapper {
    public List<EventResponse> mapList(List<EventEntity> allEvents) {
        List<EventResponse> responses = new ArrayList<>();
        for (EventEntity eventEntity : allEvents) {
            EventResponse tmp = new EventResponse();
            tmp.setRoomList(eventEntity.getRooms().stream().map(r -> new RoomResponse(r.getId(), r.getName(), r.getLocation())).collect(Collectors.toList()));
            tmp.setCreator(new SystemUserResponse(eventEntity.getCreator().getUsername(), eventEntity.getCreator().getRole(), eventEntity.getCreator().getId()));
            tmp.setIsPrivate(eventEntity.getIsPrivate());
            tmp.setEndDate(eventEntity.getEndDate());
            tmp.setStartDate(eventEntity.getStartDate());
            tmp.setId(eventEntity.getId());
            tmp.setName(eventEntity.getName());
            tmp.setDescription(eventEntity.getDescription());
            responses.add(tmp);
        }
        return responses;
    }

    public EventResponse map(EventEntity event) {
        return new EventResponse(event
                .getRooms()
                .stream().
                        map(r -> new RoomResponse(r.getId(), r.getName(), r.getLocation())).collect(Collectors.toList()),
                event.getStartDate(),
                event.getEndDate(),
                event.getIsPrivate(),
                new SystemUserResponse(event.getCreator().getUsername(), event.getCreator().getRole(), event.getCreator().getId()),
                event.getId(),
                event.getName(),
                event.getDescription());
    }
}
