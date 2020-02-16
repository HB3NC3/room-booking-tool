package hu.aut.szarch.Event.Presentation.Request;

import lombok.*;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventIntervalRequest implements Serializable {

    @NonNull
    private Instant startDate;

    @NonNull
    private Instant endDate;

}
