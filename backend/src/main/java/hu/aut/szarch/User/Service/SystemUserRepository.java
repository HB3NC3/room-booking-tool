package hu.aut.szarch.User.Service;

import hu.aut.szarch.User.Entity.SystemUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SystemUserRepository extends JpaRepository<SystemUserEntity, UUID>, JpaSpecificationExecutor<SystemUserEntity> {

    //Fontos, hogy case sensitive legyen!
    Optional<SystemUserEntity> findByUsername(String username);

    Boolean existsByUsername(String username);
}
