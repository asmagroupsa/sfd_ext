package carmes.fnm.sfdapp.service.dto;


import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the Ressource entity.
 */
public class AuthorityResourceDTO implements Serializable {

    private Long id;

    private String authority;

    private Long ressourceId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthority() {
		return authority;
	}

	public void setAuthority(String authority) {
		this.authority = authority;
	}

	public Long getRessourceId() {
		return ressourceId;
	}

	public void setRessourceId(Long ressourceId) {
		this.ressourceId = ressourceId;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        AuthorityResourceDTO ressourceDTO = (AuthorityResourceDTO) o;
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
            ", authority='" + getAuthority() + "'" +
            ", ressourceId='" + getRessourceId() + "'" +
            "}";
    }
}
