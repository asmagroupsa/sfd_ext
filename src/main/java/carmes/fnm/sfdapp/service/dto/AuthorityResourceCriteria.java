package carmes.fnm.sfdapp.service.dto;

import io.github.jhipster.service.filter.*;

import carmes.fnm.sfdapp.domain.Authority;
import io.github.jhipster.service.filter.LongFilter;
import carmes.fnm.sfdapp.domain.Authority;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Objects;

/**
 * A DTO for the Ressource entity.
 */
public class AuthorityResourceCriteria implements Serializable {

	 private static final long serialVersionUID = 1L;

	 private LongFilter id;

	    private StringFilter authority;

	    private LongFilter ressourceId;


	public AuthorityResourceCriteria() {

    }

	public LongFilter getId() {
		return id;
	}


	public void setId(LongFilter id) {
		this.id = id;
	}

	public StringFilter getAuthority() {
		return authority;
	}

	public void setAuthority(StringFilter authority) {
		this.authority = authority;
	}


	public LongFilter getRessourceId() {
		return ressourceId;
	}

	public void setRessourceId(LongFilter ressourceId) {
		this.ressourceId = ressourceId;
	}





	@Override
    public String toString() {
        return "AuthorityResourceCriteria{" +
        		(id != null ? "id=" + id + ", " : "") +
        		(authority != null ? "authority=" + authority + ", " : "") +
        		(ressourceId != null ? "ressourceId=" + ressourceId + ", " : "") +
            "}";
    }
}
