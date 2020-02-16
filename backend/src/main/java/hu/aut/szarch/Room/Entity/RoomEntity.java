package hu.aut.szarch.Room.Entity;

import hu.aut.szarch.Bases.Enity.BaseEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class RoomEntity extends BaseEntity {

    private String name;

    private String location;

}
