package hu.aut.szarch.Event.Service;

import hu.aut.szarch.Event.Entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, UUID>, JpaSpecificationExecutor<EventEntity> {

    List<EventEntity> findByIsPrivateIsFalse();

    @Query(" SELECT entity FROM EventEntity AS entity WHERE (entity.startDate BETWEEN :start AND :end AND entity.isPrivate = false ) " +
            " OR (entity.endDate BETWEEN :start AND :end AND entity.isPrivate = false) " +
            " OR (:start BETWEEN entity.startDate AND entity.endDate AND entity.isPrivate = false)" +
            " OR (:end BETWEEN entity.startDate AND entity.endDate AND entity.isPrivate = false)")
    List<EventEntity> findByStartDateIsBetweenAndIsPrivateIsFalse(@Param("start") Instant start, @Param("end") Instant end);

    @Query(" SELECT entity FROM EventEntity AS entity WHERE (entity.startDate BETWEEN :start AND :end ) " +
            " OR (entity.endDate BETWEEN :start AND :end) " +
            " OR (:start BETWEEN entity.startDate AND entity.endDate)" +
            " OR (:end BETWEEN entity.startDate AND entity.endDate)")
    List<EventEntity> findByStartDateIsBetween(@Param("start") Instant start, @Param("end") Instant end);

}
