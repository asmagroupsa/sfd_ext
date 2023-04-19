package carmes.fnm.sfdapp.domain;

import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;


import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Ressource.
 */
@Entity
@Table(name = "cf_ressource")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//@Document(indexName = "ressource")
public class Ressource implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(max = 200)
    @Column(name = "name", length = 200, nullable = false)
    private String name;

    @NotNull
    @Size(max = 200)
    @Column(name = "code", length = 200, nullable = false)
    private String code;

    @OneToMany(mappedBy = "ressource")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<AuthorityResource> authorityResources = new HashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "type_user")
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

    public Ressource name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public Ressource code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Set<AuthorityResource> getAuthorityResources() {
        return authorityResources;
    }

    public Ressource authorityResources(Set<AuthorityResource> authorityResources) {
        this.authorityResources = authorityResources;
        return this;
    }

    public Ressource addAuthorityResources(AuthorityResource authorityResource) {
        this.authorityResources.add(authorityResource);
        authorityResource.setRessource(this);
        return this;
    }

    public Ressource removeAuthorityResources(AuthorityResource authorityResource) {
        this.authorityResources.remove(authorityResource);
        authorityResource.setRessource(null);
        return this;
    }

    public void setAuthorityResources(Set<AuthorityResource> authorityResources) {
        this.authorityResources = authorityResources;
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
        Ressource ressource = (Ressource) o;
        if (ressource.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), ressource.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Ressource{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", typeUser='" + getTypeUser() + "'" +
            "}";
    }
}
