package carmes.fnm.sfdapp.repository;

import org.springframework.stereotype.Repository;

import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.domain.enumeration.TypeUser;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;

@Repository
public interface UserRepositoryCustom  extends JpaRepository<User,Long>, UserRepositoryCustom2{
	
	public Page<User> findByCreatedByAndTypeUser(String user_reference, TypeUser type_user,Pageable pageable);
}
