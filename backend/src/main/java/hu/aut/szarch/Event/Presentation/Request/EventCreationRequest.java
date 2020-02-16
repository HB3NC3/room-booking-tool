package hu.aut.szarch.Event.Presentation.Request;

import lombok.*;

import javax.validation.constraints.NotEmpty;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventCreationRequest implements Serializable {

    @NonNull
    @NotEmpty
    private List<UUID> roomIds;

    @NonNull
    private Instant startDate;

    @NonNull
    private Instant endDate;

    @NonNull
    private Boolean isPrivate;

    private String name;

    private String description;


}
