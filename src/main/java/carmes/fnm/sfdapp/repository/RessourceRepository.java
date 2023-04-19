package carmes.fnm.sfdapp.repository;

import carmes.fnm.sfdapp.domain.Ressource;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Ressource entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RessourceRepository extends JpaRepository<Ressource,Long>, JpaSpecificationExecutor<Ressource> {

}
