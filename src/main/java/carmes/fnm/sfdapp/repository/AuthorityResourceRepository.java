package carmes.fnm.sfdapp.repository;


import carmes.fnm.sfdapp.domain.AuthorityResource;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the AuthorityResource entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AuthorityResourceRepository extends JpaRepository<AuthorityResource,Long> ,JpaSpecificationExecutor<AuthorityResource>{

}
