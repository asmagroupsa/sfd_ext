package carmes.fnm.sfdapp.service;

import carmes.fnm.sfdapp.domain.CustomUser;
import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import carmes.fnm.sfdapp.repository.CustomUserRepository;
//import carmes.fnm.sfdapp.repository.search.CustomUserSearchRepository;
import carmes.fnm.sfdapp.service.dto.CustomUserDTO;
import carmes.fnm.sfdapp.service.mapper.CustomUserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service Implementation for managing CustomUser.
 */
@Service
@Transactional
public class CustomUserService {

    private final Logger log = LoggerFactory.getLogger(CustomUserService.class);

    private final CustomUserRepository customUserRepository;

    private final CustomUserMapper customUserMapper;

//    private final CustomUserSearchRepository customUserSearchRepository;

    public CustomUserService(CustomUserRepository customUserRepository, CustomUserMapper customUserMapper) {
        this.customUserRepository = customUserRepository;
        this.customUserMapper = customUserMapper;
//        this.customUserSearchRepository = customUserSearchRepository;
    }

    /**
     * Save a customUser.
     *
     * @param customUserDTO the entity to save
     * @return the persisted entity
     */
    public CustomUserDTO save(CustomUserDTO customUserDTO) {
        log.debug("Request to save CustomUser : {}", customUserDTO);
        CustomUser customUser = customUserMapper.toEntity(customUserDTO);
        customUser = customUserRepository.save(customUser);
        CustomUserDTO result = customUserMapper.toDto(customUser);
//        customUserSearchRepository.save(customUser);
        return null;
    }

    /**
     *  Get all the customUsers.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<CustomUserDTO> findAll(Pageable pageable) {
        log.debug("Request to get all CustomUsers");
        return customUserRepository.findAll(pageable)
            .map(customUserMapper::toDto);
    }

    /**
     *  Get one customUser by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public CustomUserDTO findOne(Long id) {
        log.debug("Request to get CustomUser : {}", id);
        CustomUser customUser = customUserRepository.findOne(id);
        return customUserMapper.toDto(customUser);
    }

    /**
     *  Delete the  customUser by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete CustomUser : {}", id);
        customUserRepository.delete(id);
//        customUserSearchRepository.delete(id);
    }

    /**
     * Search for the customUser corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<CustomUserDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of CustomUsers for query {}", query);
//        Page<CustomUser> result = customUserSearchRepository.search(queryStringQuery(query), pageable);
        return null;
    }
    
	@Scheduled(fixedDelay = 60000)
    public void removeTokenExpiredUsers() {
        List<CustomUser> users = customUserRepository.findAllByConnecterIsTrueAndTokenExpDateLessThanEqual(Instant.now());
        for (CustomUser user : users) {
            log.debug("Deleting token exp date user {}", user.getUser().getLogin());
            customUserRepository.setConnecter(false, user.getId());
//            //customUserSearchRepository.delete(user);
        }
        //customUserRepository.save(users);
    }
	
	 public List<CustomUser> byTypeUser(TypeUser typeUser) {
	        //log.debug("Request to search for a page of CustomUsers for query {}", query);
//	        //List<CustomUser> result = customUserSearchRepository.search(queryStringQuery(query), pageable);
	        return customUserRepository.findByUser_TypeUser(typeUser);
	    }
}
