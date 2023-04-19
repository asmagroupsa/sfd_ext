package carmes.fnm.sfdapp.domain;

import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.persistence.*;
import java.io.Serializable;

/**
 * An authority (a security role) used by Spring Security.
 */
@Entity
@Table(name = "jhi_authority")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Authority implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Size(min = 0, max = 50)
    @Id
    @Column(name = "name",length = 50)
    private String name;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "type_user")
    private TypeUser typeUser;

    private String nextLigneRequest;

    @Column(name = "partner_id")
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
    
    public Authority typeUser(TypeUser typeUser) {
        this.typeUser = typeUser;
        return this;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        Authority authority = (Authority) o;

        return !(name != null ? !name.equals(authority.name) : authority.name != null);
    }

    @Override
    public int hashCode() {
        return name != null ? name.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "Authority{" +
            "name='" + name + '\'' +
            "description='" + description + '\'' +
            "typeUser='" + typeUser + '\'' +
            "nextLigneRequest='" + nextLigneRequest + '\'' +
            "partnerId='" + partnerId + '\'' +
            "}";
    }
}
