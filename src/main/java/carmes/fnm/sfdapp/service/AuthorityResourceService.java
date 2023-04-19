package carmes.fnm.sfdapp.service;

////////import static org.elasticsearch.index.query.QueryBuilders.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import carmes.fnm.sfdapp.domain.AuthorityResource;
import carmes.fnm.sfdapp.repository.AuthorityResourceRepository;
//import carmes.fnm.sfdapp.repository.search.AuthorityResourceSearchRepository;

/**
 * Service Implementation for managing AuthorityResource.
 */
@Service
@Transactional
public class AuthorityResourceService {

    private final Logger log = LoggerFactory.getLogger(AuthorityResourceService.class);

    private final AuthorityResourceRepository authorityResourceRepository;

//    private final AuthorityResourceSearchRepository authorityResourceSearchRepository;

   public AuthorityResourceService(AuthorityResourceRepository authorityResourceRepository) {
        this.authorityResourceRepository = authorityResourceRepository;
//        this.authorityResourceSearchRepository = authorityResourceSearchRepository;
    }

    /**
     * Save a authorityResource.
     *
     * @param authorityResource the entity to save
     * @return the persisted entity
     */
    public AuthorityResource save(AuthorityResource authorityResource) {
        log.debug("Request to save AuthorityResource : {}", authorityResource);
        AuthorityResource result = authorityResourceRepository.save(authorityResource);
//        authorityResourceSearchRepository.save(result);
        return null;
    }

    /**
     *  Get all the authorityResources.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<AuthorityResource> findAll(Pageable pageable) {
        log.debug("Request to get all AuthorityResources");
        return authorityResourceRepository.findAll(pageable);
    }

    /**
     *  Get one authorityResource by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public AuthorityResource findOne(Long id) {
        log.debug("Request to get AuthorityResource : {}", id);
        return authorityResourceRepository.findOne(id);
    }

    /**
     *  Delete the  authorityResource by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete AuthorityResource : {}", id);
        authorityResourceRepository.delete(id);
//        authorityResourceSearchRepository.delete(id);
    }

    /**
     * Search for the authorityResource corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<AuthorityResource> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of AuthorityResources for query {}", query);
//        Page<AuthorityResource> result = authorityResourceSearchRepository.search(queryStringQuery(query), pageable);
        return null;
    }
}
