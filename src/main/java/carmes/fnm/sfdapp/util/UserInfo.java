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

public class UserInfo {
	//id, login,last_name,first_name,email,activated,connecter, created_by,agence_reference,sfd_reference,zone_reference, image_url,PHONE , authority
	private Long id;
	private String login;
	private String last_name;
	private String first_name;
	private String email;
	private Boolean activated;
    private Boolean connecter;
    private String created_by;
    private String agence_reference;
    private String sfd_reference;
    private String zone_reference;
    private String image_url;
    private String phone;
    private String authority;
    private String carte_url;
    private String signature_url;
	private String cle_connexion;


    public UserInfo(Long id, String login, String last_name, String first_name, String email, Boolean activated,
                    Boolean connecter, String created_by, String agence_reference, String sfd_reference, String zone_reference,
                    String image_url, String phone, String authority, String carte_url, String signature_url, String cle_connexion) {
		super();
		this.id = id;
		this.login = login;
		this.last_name = last_name;
		this.first_name = first_name;
		this.email = email;
		this.activated = activated;
		this.connecter = connecter;
		this.created_by = created_by;
		this.agence_reference = agence_reference;
		this.sfd_reference = sfd_reference;
		this.zone_reference = zone_reference;
		this.image_url = image_url;
		this.phone = phone;
		this.authority = authority;
		this.carte_url = carte_url;
		this.signature_url = signature_url;
        this.cle_connexion = cle_connexion;
	}
	public String getCreated_by() {
		return created_by;
	}
	public void setCreated_by(String created_by) {
		this.created_by = created_by;
	}
	public String getAgence_reference() {
		return agence_reference;
	}
	public void setAgence_reference(String agence_reference) {
		this.agence_reference = agence_reference;
	}
	public String getSfd_reference() {
		return sfd_reference;
	}
	public void setSfd_reference(String sfd_reference) {
		this.sfd_reference = sfd_reference;
	}
	public String getZone_reference() {
		return zone_reference;
	}
	public void setZone_reference(String zone_reference) {
		this.zone_reference = zone_reference;
	}
	public String getImage_url() {
		return image_url;
	}
	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAuthority() {
		return authority;
	}
	public void setAuthority(String authority) {
		this.authority = authority;
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
	public String getCarte_url() {
		return carte_url;
	}
	public void setCarte_url(String carte_url) {
		this.carte_url = carte_url;
	}
	public String getSignature_url() {
		return signature_url;
	}
	public void setSignature_url(String signature_url) {
		this.signature_url = signature_url;
	}


    public String getCle_connexion() {
        return cle_connexion;
    }

    public void setCle_connexion(String cle_connexion) {
        this.cle_connexion = cle_connexion;
    }
}
