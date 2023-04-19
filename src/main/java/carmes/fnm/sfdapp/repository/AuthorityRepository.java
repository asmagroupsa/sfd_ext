package carmes.fnm.sfdapp.repository;


import carmes.fnm.sfdapp.domain.Authority;

import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;

/**
 * Spring Data JPA repository for the Authority entity.
 */
@Repository
public interface AuthorityRepository extends JpaRepository<Authority, String> , JpaSpecificationExecutor<Authority>{
}
