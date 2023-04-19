package carmes.fnm.sfdapp.service.dto;


import javax.validation.constraints.*;

import carmes.fnm.sfdapp.domain.User;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the CustomUser entity.
 */
public class CustomUserDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(max = 50)
    private String code;

    private String agenceReference;

    private String sfdReference;

    private String zoneReference;

    private Boolean connecter;

    private Instant tokenExpDate;

    private Long userId;
    
    private User user;
    
    

    public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

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

    public void setCode(String code) {
        this.code = code;
    }

    public String getAgenceReference() {
        return agenceReference;
    }

    public void setAgenceReference(String agenceReference) {
        this.agenceReference = agenceReference;
    }

    public String getSfdReference() {
        return sfdReference;
    }

    public void setSfdReference(String sfdReference) {
        this.sfdReference = sfdReference;
    }

    public String getZoneReference() {
        return zoneReference;
    }

    public void setZoneReference(String zoneReference) {
        this.zoneReference = zoneReference;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CustomUserDTO customUserDTO = (CustomUserDTO) o;
        if(customUserDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), customUserDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CustomUserDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", agenceReference='" + getAgenceReference() + "'" +
            ", sfdReference='" + getSfdReference() + "'" +
            ", zoneReference='" + getZoneReference() + "'" +
            "}";
    }
}
