package carmes.fnm.sfdapp.service.dto;

import carmes.fnm.sfdapp.config.Constants;

import carmes.fnm.sfdapp.domain.Authority;
import carmes.fnm.sfdapp.domain.User;

import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.validation.constraints.*;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * A DTO representing a user, with his authorities.
 */
public class UserDTO {

    private Long id;

    @NotBlank
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 50)
    private String login;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Email
    @Size(min = 5, max = 100)
    private String email;

    @Size(max = 256)
    private String imageUrl;

    private boolean activated = false;

    @Size(min = 2, max = 5)
    private String langKey;

    private String createdBy;

    private Instant createdDate;

    private String lastModifiedBy;

    private Instant lastModifiedDate;

    private Set<String> authorities;
    private Set<Authority> authoritiesObj = new HashSet<>();

    private Boolean firstConnection;

    private TypeUser typeUser;

    private Instant dateFunction ;

    private Instant dateEndFunction;

    private String signatureUrl;

    private String cleConnexion;

    public UserDTO() {
        // Empty constructor needed for Jackson.
    }

    public 
    UserDTO(User user) {
        this(user.getId(), user.getLogin(), user.getFirstName(), user.getLastName(), user.getFirstConnection(),
            user.getTypeUser(),user.getEmail(), user.getActivated(), user.getImageUrl(), user.getLangKey(),
            user.getCreatedBy(), user.getCreatedDate(), user.getLastModifiedBy(), user.getLastModifiedDate(),
            user.getAuthorities().stream().map(Authority::getName)
                .collect(Collectors.toSet()), user.getAuthorities(), user.getDateFunction(), user.getDateEndFunction(), 
                user.getSignatureUrl() , user.getCleConnexion());
    }

    public UserDTO(Long id, String login, String firstName, String lastName, Boolean firstConnection,
                   TypeUser typeUser, String email, boolean activated, String imageUrl, String langKey,
        String createdBy, Instant createdDate, String lastModifiedBy, Instant lastModifiedDate,
        Set<String> authorities, Set<Authority> authoritiesObj, Instant dateFunction, Instant dateEndFunction, String signatureUrl, String cleConnexion) {

        this.id = id;
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.activated = activated;
        this.firstConnection = firstConnection;
        this.imageUrl = imageUrl;
        this.langKey = langKey;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.lastModifiedBy = lastModifiedBy;
        this.lastModifiedDate = lastModifiedDate;
        this.authorities = authorities;
        this.authoritiesObj  = authoritiesObj;
        this.typeUser = typeUser;
        this.dateFunction = dateFunction;
        this.dateEndFunction = dateEndFunction;
        this.signatureUrl = signatureUrl;
        this.cleConnexion = cleConnexion;
    }
    
    


    public Set<Authority> getAuthoritiesObj() {
		return authoritiesObj;
	}

	public void setAuthoritiesObj(Set<Authority> authoritiesObj) {
		this.authoritiesObj = authoritiesObj;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public boolean isActivated() {
        return activated;
    }

    public Boolean isFirstConnection() {
        return firstConnection;
    }

    public String getLangKey() {
        return langKey;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public Instant getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public TypeUser getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(TypeUser typeUser) {
        this.typeUser = typeUser;
    }
    
    

    public Instant getDateFunction() {
		return dateFunction;
	}

	public void setDateFunction(Instant dateFunction) {
		this.dateFunction = dateFunction;
	}

	public Instant getDateEndFunction() {
		return dateEndFunction;
	}

	public void setDateEndFunction(Instant dateEndFunction) {
		this.dateEndFunction = dateEndFunction;
	}

	public String getSignatureUrl() {
		return signatureUrl;
	}

	public void setSignatureUrl(String signatureUrl) {
		this.signatureUrl = signatureUrl;
	}

    public String getCleConnexion() {
        return cleConnexion;
    }

    public void setCleConnexion(String cleConnexion) {
        this.cleConnexion = cleConnexion;
    }

	@Override
    public String toString() {
        return "UserDTO{" +
            "login='" + login + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", imageUrl='" + imageUrl + '\'' +
            ", activated=" + activated +
            ", langKey='" + langKey + '\'' +
            ", createdBy=" + createdBy +
            ", createdDate=" + createdDate +
            ", lastModifiedBy='" + lastModifiedBy + '\'' +
            ", lastModifiedDate=" + lastModifiedDate +
            ", authorities=" + authorities +
            ", typeUser=" + typeUser +
            "}";
    }
}
