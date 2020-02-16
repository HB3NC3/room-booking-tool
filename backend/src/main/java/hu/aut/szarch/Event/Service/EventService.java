package hu.aut.szarch.Event.Service;

import hu.aut.szarch.Event.Entity.EventEntity;
import hu.aut.szarch.Event.Presentation.Request.EventCreationRequest;
import hu.aut.szarch.Event.Presentation.Request.EventIntervalRequest;
import hu.aut.szarch.Event.Presentation.Request.EventUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface EventService {
    List<EventEntity> getAllEvents();

    List<EventEntity> findAllInInterval(EventIntervalRequest intervalRequest);

    EventEntity createEvent(EventCreationRequest eventCreateRequest);

    EventEntity modifyEvent(UUID id, EventUpdateRequest eventUpdateRequest);

    void deleteEvent(UUID id);

    EventEntity findById(UUID id);

    List<EventEntity> findAllInIntervalById(UUID id, EventIntervalRequest intervalRequest);
}
