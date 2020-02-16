package hu.aut.szarch.Event.Presentation;

import hu.aut.szarch.Event.Presentation.Request.EventCreationRequest;
import hu.aut.szarch.Event.Presentation.Request.EventIntervalRequest;
import hu.aut.szarch.Event.Presentation.Request.EventUpdateRequest;
import hu.aut.szarch.Event.Presentation.Response.EventResponse;
import hu.aut.szarch.Event.Service.EventService;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/event")
public class EventController {

    private EventService eventService;

    private EventMapper mapper;

    public EventController(EventService eventService, EventMapper mapper) {
        this.eventService = eventService;
        this.mapper = mapper;
    }

    @GetMapping("/all")
    public List<EventResponse> getAllEvents() {
        return mapper.mapList(eventService.getAllEvents());
    }

    @PostMapping("/interval/{id}")
    public List<EventResponse> getEventsInIntervalAndRoomId(@RequestParam UUID id, @RequestBody @Valid EventIntervalRequest intervalRequest){
        return mapper.mapList(eventService.findAllInIntervalById(id, intervalRequest));
    }

    @PostMapping("/interval")
    public List<EventResponse> getEventsInInterval(@RequestBody @Valid EventIntervalRequest intervalRequest){
        return mapper.mapList(eventService.findAllInInterval(intervalRequest));
    }

    @GetMapping("/{id}")
    public EventResponse getOne(@PathVariable UUID id){
        return mapper.map(eventService.findById(id));
    }

    @PostMapping
    public EventResponse registerEvent(@RequestBody @Valid EventCreationRequest eventCreationRequest) {
        return mapper.map(eventService.createEvent(eventCreationRequest));
    }

    @PutMapping("/{id}")
    public EventResponse modifyEvent(@PathVariable UUID id, @RequestBody @Valid EventUpdateRequest eventUpdateRequest) {
        return mapper.map(eventService.modifyEvent(id, eventUpdateRequest));
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
    }


}
