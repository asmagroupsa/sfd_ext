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

public class RessourceCodeInfo {

    private String code;

	public RessourceCodeInfo(String code) {
		super();
		this.code = code;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
   
    
}
