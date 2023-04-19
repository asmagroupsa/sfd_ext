package carmes.fnm.sfdapp.web.rest;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import carmes.fnm.sfdapp.service.UserServiceCustom;
import carmes.fnm.sfdapp.service.dto.UserDTO;
import carmes.fnm.sfdapp.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing Client.
 */
@RestController
@RequestMapping("/api/user/custom")
public class UserResourceCustom{
	
	 private final Logger log = LoggerFactory.getLogger(UserResourceCustom.class);

	 //private static final String ENTITY_NAME = "client";

	 private final UserServiceCustom userServiceCustom;

	public UserResourceCustom(UserServiceCustom userServiceCustom) {
		this.userServiceCustom = userServiceCustom;
		// TODO Auto-generated constructor stub
	}

	
	@GetMapping("/by-user-reference")
	@Timed
    public ResponseEntity<List<UserDTO>> getAllUsersByUser(@ApiParam Pageable pageable, @RequestParam String user_reference,String type_user) {
        
        log.debug("REST request to get clients by category");
        Page<UserDTO> page = userServiceCustom.findAllByUser(pageable,user_reference,type_user);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/user/custom/by-user-reference");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
        
    }



}
