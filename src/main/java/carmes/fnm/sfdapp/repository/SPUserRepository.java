package carmes.fnm.sfdapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import carmes.fnm.sfdapp.domain.CustomUser;

public interface SPUserRepository extends JpaRepository<CustomUser,Long>, SPUserRepository2 {
	
}


