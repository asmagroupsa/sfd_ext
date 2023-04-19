package carmes.fnm.sfdapp.service;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import carmes.fnm.sfdapp.repository.UserRepositoryCustom;
//import carmes.fnm.sfdapp.repository.search.UserSearchRepository;
import carmes.fnm.sfdapp.service.dto.UserDTO;
import carmes.fnm.sfdapp.service.mapper.UserMapper;

/**
 * Service Implementation for managing Client.
 */
@Service
@Transactional
public class UserServiceCustom {
	
	 private final Logger log = LoggerFactory.getLogger(UserServiceCustom.class);

	 private final UserRepositoryCustom userRepositoryCustom;
	 
	 

	public  UserServiceCustom(UserRepositoryCustom userRepositoryCustom1) {
		this.userRepositoryCustom = userRepositoryCustom1;
       
	}
	
	

	public Page<UserDTO> findAllByUser(Pageable pageable,String user_reference,String type_user) {
		// TODO Auto-generated method stub		
		TypeUser type_user_enum = null == type_user ?null:TypeUser.valueOf(type_user);
		return this.userRepositoryCustom.findByCreatedByAndTypeUser(user_reference,type_user_enum , pageable).map(UserDTO::new);
	}

   
}
