package hu.aut.szarch.User.Entity;

import hu.aut.szarch.Bases.Enity.BaseEntity;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
public class SystemUserEntity extends BaseEntity {

    @NonNull
    @Column(unique = true, nullable = false)
    private String username;

    @NonNull
    private String password;

    private Role role;

    public void setRole(Role role){
        this.role = role;
    }
}
