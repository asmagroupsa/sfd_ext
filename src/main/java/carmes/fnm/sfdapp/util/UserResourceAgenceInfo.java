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

public class UserResourceAgenceInfo {
    private String ressource;
    private String sfd_reference;
    private String agence_reference;
    private String zone_reference;
    private String user_reference;
	private String liste_agence;
	private String code_partenaire;
	private Long partner_id;
	private Long country_id;

	public UserResourceAgenceInfo(String ressource, String sfd_reference, String agence_reference,
			String zone_reference, String user_reference, String liste_agence, String code_partenaire,
			 Long partner_id, Long country_id) {
		super();
		this.ressource = ressource;
		this.sfd_reference = sfd_reference;
		this.agence_reference = agence_reference;
		this.zone_reference = zone_reference;
		this.user_reference = user_reference;
		this.liste_agence = liste_agence;
		this.code_partenaire = code_partenaire;
		this.partner_id = partner_id;
		this.country_id = country_id;

	}
	public String getRessource() {
		return ressource;
	}
	public void setRessource(String ressource) {
		this.ressource = ressource;
	}
	public String getSfd_reference() {
		return sfd_reference;
	}
	public void setSfd_reference(String sfd_reference) {
		this.sfd_reference = sfd_reference;
	}
	public String getAgence_reference() {
		return agence_reference;
	}
	public void setAgence_reference(String agence_reference) {
		this.agence_reference = agence_reference;
	}
	public String getZone_reference() {
		return zone_reference;
	}
	public void setZone_reference(String zone_reference) {
		this.zone_reference = zone_reference;
	}
	public String getUser_reference() {
		return user_reference;
	}
	public void setUser_reference(String user_reference) {
		this.user_reference = user_reference;
	}
	public String getListe_agence() {
		return liste_agence;
	}
	public void setListe_agence(String liste_agence) {
		this.liste_agence = liste_agence;
	}
    
    public String getCode_partenaire() {
		return code_partenaire;
	}
	public void setCode_partenaire(String code_partenaire) {
		this.code_partenaire = code_partenaire;
	}

	public Long getPartner_id() {
		return partner_id;
	}
	public void setPartner_id(Long partner_id) {
		this.partner_id = partner_id;
	}

	public Long getCountry_id() {
		return country_id;
	}
	public void setCountry_id(Long country_id) {
		this.country_id = country_id;
	}
    
}
