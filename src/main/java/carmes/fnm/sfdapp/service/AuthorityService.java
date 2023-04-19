package carmes.fnm.sfdapp.service;

import carmes.fnm.sfdapp.domain.Authority;
import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.repository.AuthorityRepository;
import carmes.fnm.sfdapp.service.dto.AuthorityDTO;
import carmes.fnm.sfdapp.service.dto.UserDTO;
import carmes.fnm.sfdapp.service.mapper.AuthorityMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing Authority.
 */
@Service
@Transactional
public class AuthorityService {

    private final Logger log = LoggerFactory.getLogger(AuthorityService.class);

    private final AuthorityRepository authorityRepository;

    private final AuthorityMapper authorityMapper;

//    //private final AuthoritySearchRepository authoritySearchRepository;

    public AuthorityService(AuthorityRepository authorityRepository, AuthorityMapper authorityMapper) {
        this.authorityRepository = authorityRepository;
        this.authorityMapper = authorityMapper;
    }

    /**
     * Save a authority.
     *
     * @param authorityDTO the entity to save
     * @return the persisted entity
     */
    public AuthorityDTO save(AuthorityDTO authorityDTO) {
        log.debug("Request to save Authority : {}", authorityDTO);
        Authority authority = authorityMapper.authorityDTOToAuthority(authorityDTO);
        log.debug("Request to save Authority entity: {}", authority);
        authority = authorityRepository.save(authority);
        AuthorityDTO result = authorityMapper.authorityToAuthorityDTO(authority);
//        //authoritySearchRepository.save(authority);
        return null;

    }

    /**
     *  Get all the authoritys.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<AuthorityDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Authoritys");
        return authorityRepository.findAll(pageable)
        		.map(AuthorityDTO::new);
    }

    /**
     *  Get one authority by name.
     *
     *  @param name the name of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public AuthorityDTO findOne(String name) {
        log.debug("Request to get Authority : {}", name);
        Authority authority = authorityRepository.findOne(name);
        return authorityMapper.authorityToAuthorityDTO(authority);
    }

    /**
     *  Delete the  authority by name.
     *
     *  @param name the name of the entity
     */
    public void delete(String name) {
        log.debug("Request to delete Authority : {}", name);
        authorityRepository.delete(name);
//        //authoritySearchRepository.delete(name);
    }

    /**
     * Search for the authority corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    /*Transactional(readOnly = true)
    public Page<AuthorityDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Authoritys for query {}", query);
//        Page<Authority> result = authoritySearchRepository.search(queryStringQuery(query), pageable);
        return result.map(authorityMapper::toDto);
    }*/

    public AuthorityDTO nextLigneRequestUpdate(String name, String valeur, String action) {
        log.debug("Request to get Authority : {}", name);
        Authority authority = authorityRepository.findOne(name);
        String nextLigneRequest =authority.getNextLigneRequest();

            if (action.equals("ADD")) {
                String finalNextLigneRequest =null==nextLigneRequest || "".equals(nextLigneRequest)? valeur: nextLigneRequest + "*" + valeur;
                authority.setNextLigneRequest(finalNextLigneRequest);
            }
        if (null!=nextLigneRequest) {
            if (action.equals("DELETE")) {
                //nextLigneRequest = nextLigneRequest.replace(valeur,"");
                nextLigneRequest = nextLigneRequest.replace(valeur, "");
                if (!nextLigneRequest.isEmpty()) {
                    if('*'==nextLigneRequest.charAt(0)){
                        nextLigneRequest= nextLigneRequest.substring(1);
                    }else if('*'==nextLigneRequest.charAt(nextLigneRequest.length()-1)){
                        nextLigneRequest= nextLigneRequest.substring(0,nextLigneRequest.length()-1);
                    }else {
                        nextLigneRequest = nextLigneRequest.replace("**", "*");
                    }

                }
                authority.setNextLigneRequest(nextLigneRequest);

            }
        }
        return authorityMapper.authorityToAuthorityDTO(authority);
    }
}
