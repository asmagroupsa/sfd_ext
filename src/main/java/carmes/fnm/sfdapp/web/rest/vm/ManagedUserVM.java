package carmes.fnm.sfdapp.web.rest.vm;

import carmes.fnm.sfdapp.domain.Authority;
import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import carmes.fnm.sfdapp.service.dto.UserDTO;
import javax.validation.constraints.Size;

import java.time.Instant;
import java.util.Set;

/**
 * View Model extending the UserDTO, which is meant to be used in the user management UI.
 */
public class ManagedUserVM extends UserDTO {

    public static final int PASSWORD_MIN_LENGTH = 4;

    public static final int PASSWORD_MAX_LENGTH = 100;

    @Size(min = PASSWORD_MIN_LENGTH, max = PASSWORD_MAX_LENGTH)
    private String password;

    public ManagedUserVM() {
        // Empty constructor needed for Jackson.
    }

    public ManagedUserVM(Long id, String login, String password, String firstName, String lastName, boolean firstConnection,
                         TypeUser typeUser, String email, boolean activated, String imageUrl, String langKey,
                         String createdBy, Instant createdDate, String lastModifiedBy, Instant lastModifiedDate,
                         Set<String> authorities, Set<Authority> authoritiesObj, Instant dateFunction, Instant dateEndFunction, 
                         String signatureUrl, String cleConnexion ) {

        super(id, login, firstName, lastName,firstConnection, typeUser, email, activated, imageUrl, langKey,
            createdBy, createdDate, lastModifiedBy, lastModifiedDate,  authorities,authoritiesObj, dateFunction,
             dateEndFunction,signatureUrl,cleConnexion);

        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "ManagedUserVM{" +
            "} " + super.toString();
    }
}
