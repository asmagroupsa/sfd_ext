package carmes.fnm.sfdapp.repository;

import carmes.fnm.sfdapp.domain.CustomUser;
import carmes.fnm.sfdapp.domain.enumeration.TypeUser;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;


import java.time.Instant;
import java.util.List;

/**
 * Spring Data JPA repository for the CustomUser entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomUserRepository extends JpaRepository<CustomUser,Long> , JpaSpecificationExecutor<CustomUser>{

    @Query("select cf_custom_user from CustomUser cf_custom_user where cf_custom_user.user.login = ?#{principal.username}")
    CustomUser findByUserIsCurrentUser();

    @Modifying
    @Query("update CustomUser cu set cu.connecter = :status  where cu.id = :id")
    int setConnecter(@Param("status") Boolean status, @Param("id") Long id);

    @Transactional
    @Modifying
    @Query("update CustomUser cu set cu.tokenExpDate = :tokenExpDate  where cu.id = :id")
    int setTokenExpDate(@Param("tokenExpDate") Instant tokenExpDate, @Param("id") Long id);

	List<CustomUser> findAllByConnecterIsTrueAndTokenExpDateLessThanEqual(Instant now);
	
	List<CustomUser> findByUser_TypeUser(TypeUser typeUser);

}
