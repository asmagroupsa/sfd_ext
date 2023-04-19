package carmes.fnm.sfdapp.util;


import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the Operation entity.
 */

public class UserSFDInfo {
	//id, login,last_name,first_name,email,activated,connecter, created_by,agence_reference,sfd_reference,zone_reference, image_url,PHONE , authority 
	private Long id;
	private String login;
	private String last_name;
	private String first_name;
	private String email;
	private Boolean activated;
    private Boolean connecter;
    
    
	public UserSFDInfo(Long id, String login, String last_name, String first_name, String email, Boolean activated,
			Boolean connecter) {
		super();
		this.id = id;
		this.login = login;
		this.last_name = last_name;
		this.first_name = first_name;
		this.email = email;
		this.activated = activated;
		this.connecter = connecter;
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
	public String getLast_name() {
		return last_name;
	}
	public void setLast_name(String last_name) {
		this.last_name = last_name;
	}
	public String getFirst_name() {
		return first_name;
	}
	public void setFirst_name(String first_name) {
		this.first_name = first_name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public Boolean getActivated() {
		return activated;
	}
	public void setActivated(Boolean activated) {
		this.activated = activated;
	}
	public Boolean getConnecter() {
		return connecter;
	}
	public void setConnecter(Boolean connecter) {
		this.connecter = connecter;
	}
   
    
}
