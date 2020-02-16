package hu.aut.szarch.Bases.Enity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import java.util.UUID;

@Getter
@Setter
@EqualsAndHashCode(of = "id")
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    protected UUID id;

    /**
     * A default konstruktor generalja a UUID-t minden esetben, igy Hibernate buveszkedes nelkul felulirhato tetszes
     * szerint.
     */
    public BaseEntity() {
        id = UUID.randomUUID();
    }

    public void setIdFromString(String id) {
        this.id = UUID.fromString(id);
    }
}