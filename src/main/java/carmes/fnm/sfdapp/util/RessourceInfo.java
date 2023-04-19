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

public class RessourceInfo {

	private Long id;
    private String code;
    private String name;
    
    
	public RessourceInfo(Long id, String code, String name) {
		super();
		this.id = id;
		this.code = code;
		this.name = name;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
    
    
    
    
}
