package carmes.fnm.sfdapp.service.dto;

import javax.validation.constraints.*;

import carmes.fnm.sfdapp.domain.Authority;
import carmes.fnm.sfdapp.domain.Authority;
import carmes.fnm.sfdapp.domain.enumeration.TypeUser;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Objects;

/**
 * A DTO for the Ressource entity.
 */
public class AuthorityDTO implements Serializable {

    
    @Size(max = 200)
    private String name;

    private String description;

    private TypeUser typeUser;

    private String nextLigneRequest;

    private Long partnerId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TypeUser getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(TypeUser typeUser) {
        this.typeUser = typeUser;
    }

    public String getNextLigneRequest() {
        return nextLigneRequest;
    }

    public void setNextLigneRequest(String nextLigneRequest) {
        this.nextLigneRequest = nextLigneRequest;
    }

    public Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(Long partnerId) {
        this.partnerId = partnerId;
    }

    public AuthorityDTO() {

    }

    public AuthorityDTO(Authority authority) {
        this(authority.getName(), authority.getDescription(), authority.getTypeUser(), authority.getNextLigneRequest(),
                authority.getPartnerId());
        
    }

    public AuthorityDTO(String name, String description, TypeUser typeUser, String nextLigneRequest, Long partnerId) {
		super();
		this.name = name;
		this.description = description;
		this.typeUser = typeUser;
        this.nextLigneRequest = nextLigneRequest;
        this.partnerId = partnerId;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        AuthorityDTO authorityDTO = (AuthorityDTO) o;
        if(authorityDTO.getName() == null || getName() == null) {
            return false;
        }
        return Objects.equals(getName(), authorityDTO.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getName());
    }

    @Override
    public String toString() {
        return "AuthorityDTO{" +
            "name='" + getName() + "'" +
            "description='" + getDescription() + "'" +
            "typeUser='" + getTypeUser() + "'" +
            "nextLigneRequest='" + getNextLigneRequest() + "'" +
            "partnerId='" + getPartnerId() + "'" +
            "}";
    }
}
