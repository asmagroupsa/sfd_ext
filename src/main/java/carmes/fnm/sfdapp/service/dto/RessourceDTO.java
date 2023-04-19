package carmes.fnm.sfdapp.service.dto;


import carmes.fnm.sfdapp.domain.enumeration.TypeUser;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the Ressource entity.
 */
public class RessourceDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 200)
    private String name;

    @NotNull
    @Size(max = 200)
    private String code;

    private TypeUser typeUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public TypeUser getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(TypeUser typeUser) {
        this.typeUser = typeUser;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        RessourceDTO ressourceDTO = (RessourceDTO) o;
        if(ressourceDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), ressourceDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "RessourceDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", typeUser='" + getTypeUser() + "'" +
            "}";
    }
}
