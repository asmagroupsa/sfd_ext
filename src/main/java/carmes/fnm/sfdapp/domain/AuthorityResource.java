package carmes.fnm.sfdapp.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;


import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A AuthorityResource.
 */
@Entity
@Table(name = "cf_authority_ressource")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//@Document(indexName = "authorityresource")
public class AuthorityResource implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 200)
    @Column(name = "authority", length = 200, nullable = false)
    private String authority;

    @ManyToOne
    private Ressource ressource;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuthority() {
        return authority;
    }

    public AuthorityResource authority(String authority) {
        this.authority = authority;
        return this;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }

    public Ressource getRessource() {
        return ressource;
    }

    public AuthorityResource ressource(Ressource ressource) {
        this.ressource = ressource;
        return this;
    }

    public void setRessource(Ressource ressource) {
        this.ressource = ressource;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AuthorityResource authorityResource = (AuthorityResource) o;
        if (authorityResource.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), authorityResource.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "AuthorityResource{" +
            "id=" + getId() +
            ", authority='" + getAuthority() + "'" +
            "}";
    }
}
