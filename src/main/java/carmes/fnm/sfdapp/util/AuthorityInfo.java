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

public class AuthorityInfo {


    
    private Date created_date;
    private String num_account;
    private String observation;
	private Double debit;
    private Double credit;
    private String sens;

    
    
	public AuthorityInfo(Date created_date, String num_account, String observation, Double debit, Double credit,
			String sens) {
		super();
		this.created_date = created_date;
		this.num_account = num_account;
		this.observation = observation;
		this.debit = debit;
		this.credit = credit;
		this.sens = sens;
	}
	public Double getDebit() {
		return debit;
	}
	public void setDebit(Double debit) {
		this.debit = debit;
	}
	public Double getCredit() {
		return credit;
	}
	public void setCredit(Double credit) {
		this.credit = credit;
	}
	public String getObservation() {
		return observation;
	}
	public void setObservation(String observation) {
		this.observation = observation;
	}
	public Date getCreated_date() {
		return created_date;
	}
	public void setCreated_date(Date created_date) {
		this.created_date = created_date;
	}
	public String getNum_account() {
		return num_account;
	}
	public void setNum_account(String num_account) {
		this.num_account = num_account;
	}
	public String getSens() {
		return sens;
	}
	public void setSens(String sens) {
		this.sens = sens;
	}
	
	
	

}
