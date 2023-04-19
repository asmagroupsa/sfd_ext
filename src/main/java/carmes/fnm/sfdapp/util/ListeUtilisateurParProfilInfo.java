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

public class ListeUtilisateurParProfilInfo {
	//id, login,last_name,first_name,email,activated,connecter, created_by,agence_reference,sfd_reference,zone_reference, image_url,PHONE , authority 
	private Long id;
	private String name;
	private String user_reference;
	private String login;
	private String email;
	private String client_id;


	public ListeUtilisateurParProfilInfo(Long id, String name, String user_reference, String login, String email,
			String client_id) {
		super();
		this.id = id;
		this.name = name;
		this.user_reference = user_reference;
		this.login = login;
		this.email = email;
		this.client_id = client_id;
	}




	public String getClient_id() {
		return client_id;
	}




	public void setClient_id(String client_id) {
		this.client_id = client_id;
	}




	public String getEmail() {
		return email;
	}




	public void setEmail(String email) {
		this.email = email;
	}




	public Long getId() {
		return id;
	}




	public void setId(Long id) {
		this.id = id;
	}




	public String getName() {
		return name;
	}




	public void setName(String name) {
		this.name = name;
	}




	public String getUser_reference() {
		return user_reference;
	}




	public void setUser_reference(String user_reference) {
		this.user_reference = user_reference;
	}




	public String getLogin() {
		return login;
	}




	public void setLogin(String login) {
		this.login = login;
	}
	

	

}
