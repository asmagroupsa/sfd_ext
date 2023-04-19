package carmes.fnm.sfdapp.util;

public class ListeUtilisateurAgenceInfo {

	private Long id;
	
	private String reference;
	
	private String login;
	
	private String name;
	
	private String first_name;
	
	private String authorities;

	public ListeUtilisateurAgenceInfo(Long id, String reference, String login, String name, String first_name,
			String authorities) {
		super();
		this.id = id;
		this.reference = reference;
		this.login = login;
		this.name = name;
		this.first_name = first_name;
		this.authorities = authorities;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getReference() {
		return reference;
	}

	public void setReference(String reference) {
		this.reference = reference;
	}

	public String getLogin() {
		return login;
	}

	public void setLogin(String login) {
		this.login = login;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFirstNname() {
		return first_name;
	}

	public void setFirstName(String first_name) {
		this.first_name = first_name;
	}

	public String getAuthorities() {
		return authorities;
	}

	public void setAuthorities(String authorities) {
		this.authorities = authorities;
	}
	
	
}
