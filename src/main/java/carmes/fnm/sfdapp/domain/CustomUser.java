package carmes.fnm.sfdapp.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;


import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A CustomUser.
 */
@Entity
@Table(name = "cf_custom_user")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
//@Document(indexName = "customuser")
public class CustomUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "code", length = 50, nullable = false)
    private String code;

    @Column(name = "agence_reference")
    private String agenceReference;

    @Column(name = "sfd_reference")
    private String sfdReference;

    @Column(name = "zone_reference")
    private String zoneReference;
    
    @Column(name = "connecter")
    private Boolean connecter;
    
    @Column(name = "token_exp_date")
    private Instant tokenExpDate;

    @ManyToOne(fetch=FetchType.EAGER)
    private User user;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    

    public Instant getTokenExpDate() {
		return tokenExpDate;
	}

	public void setTokenExpDate(Instant tokenExpDate) {
		this.tokenExpDate = tokenExpDate;
	}

	public Boolean getConnecter() {
		return connecter;
	}

	public void setConnecter(Boolean connecter) {
		this.connecter = connecter;
	}



	public String getCode() {
        return code;
    }

    public CustomUser code(String code) {
        this.code = code;
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getAgenceReference() {
        return agenceReference;
    }

    public CustomUser agenceReference(String agenceReference) {
        this.agenceReference = agenceReference;
        return this;
    }

    public void setAgenceReference(String agenceReference) {
        this.agenceReference = agenceReference;
    }

    public String getSfdReference() {
        return sfdReference;
    }

    public CustomUser sfdReference(String sfdReference) {
        this.sfdReference = sfdReference;
        return this;
    }

    public void setSfdReference(String sfdReference) {
        this.sfdReference = sfdReference;
    }

    public String getZoneReference() {
        return zoneReference;
    }

    public CustomUser zoneReference(String zoneReference) {
        this.zoneReference = zoneReference;
        return this;
    }

    public void setZoneReference(String zoneReference) {
        this.zoneReference = zoneReference;
    }

    public User getUser() {
        return user;
    }

    public CustomUser user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CustomUser customUser = (CustomUser) o;
        if (customUser.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), customUser.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CustomUser{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", agenceReference='" + getAgenceReference() + "'" +
            ", sfdReference='" + getSfdReference() + "'" +
            ", zoneReference='" + getZoneReference() + "'" +
            "}";
    }
}
