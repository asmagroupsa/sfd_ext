package carmes.fnm.sfdapp.util;


import java.time.Instant;
import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

public class QrCodeUserFNMInfo {
	private Long id;
	private String login;
	private String last_name;
	private String first_name;
	
	private String authority_name;
	private String image_url;
	private String signature_url;
	private Instant date_function;
	private Instant date_end_function;
	private String phone;
	private String email;
	private String carte_url;
	
	public QrCodeUserFNMInfo(Long id, String login, String last_name, String first_name, String authority_name,
			String image_url, String signature_url, Instant date_function, Instant date_end_function, String phone,
			String email, String carte_url) {
		super();
		this.id = id;
		this.login = login;
		this.last_name = last_name;
		this.first_name = first_name;
		this.authority_name = authority_name;
		this.image_url = image_url;
		this.signature_url = signature_url;
		this.date_function = date_function;
		this.date_end_function = date_end_function;
		this.phone = phone;
		this.email = email;
		this.carte_url = carte_url;
	}

	public String getCarte_url() {
		return carte_url;
	}



	public void setCarte_url(String carte_url) {
		this.carte_url = carte_url;
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
	public String getAuthority_name() {
		return authority_name;
	}
	public void setAuthority_name(String authority_name) {
		this.authority_name = authority_name;
	}
	public String getImage_url() {
		return image_url;
	}
	public void setImage_url(String image_url) {
		this.image_url = image_url;
	}
	public String getSignature_url() {
		return signature_url;
	}
	public void setSignature_url(String signature_url) {
		this.signature_url = signature_url;
	}
	public Instant getDate_function() {
		return date_function;
	}
	public void setDate_function(Instant date_function) {
		this.date_function = date_function;
	}
	public Instant getDate_end_function() {
		return date_end_function;
	}
	public void setDate_end_function(Instant date_end_function) {
		this.date_end_function = date_end_function;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	
    
}
