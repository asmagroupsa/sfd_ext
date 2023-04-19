package carmes.fnm.sfdapp.util;


import java.time.LocalDate;
import javax.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DTO for the Operation entity.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class CarmesResultInfo {

    private String message;
    private String error;
    
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
    

}
