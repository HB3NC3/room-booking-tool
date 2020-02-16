package hu.aut.szarch.Event.Entity;

import hu.aut.szarch.Bases.Enity.BaseEntity;
import hu.aut.szarch.Room.Entity.RoomEntity;
import hu.aut.szarch.User.Entity.SystemUserEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.Instant;
import java.util.List;

@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class EventEntity extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "creator")
    private SystemUserEntity creator;

    @ManyToMany
    @JoinTable(name = "event_entity_rooms",
            joinColumns = @JoinColumn(name = "room_id")
    )
    private List<RoomEntity> rooms;

    private Instant startDate;

    private Instant endDate;

    private Boolean isPrivate = false;

    private String name;

    private String description;


}
