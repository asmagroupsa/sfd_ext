package carmes.fnm.sfdapp.service;

////////import static org.elasticsearch.index.query.QueryBuilders.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import carmes.fnm.sfdapp.domain.AuthorityResource;
import carmes.fnm.sfdapp.repository.AuthorityResourceRepository;
//import carmes.fnm.sfdapp.repository.search.AuthorityResourceSearchRepository;
import carmes.fnm.sfdapp.service.dto.AuthorityResourceCriteria;
import carmes.fnm.sfdapp.service.dto.AuthorityResourceDTO;
import carmes.fnm.sfdapp.service.mapper.AuthorityResourceMapper;
import io.github.jhipster.service.QueryService;

import carmes.fnm.sfdapp.domain.*;

/**
 * Service Implementation for managing AuthorityResource.
 */
@Service
@Transactional(readOnly = true)
public class AuthorityResourceQueryService extends QueryService<AuthorityResource>{

    private final Logger log = LoggerFactory.getLogger(AuthorityResourceQueryService.class);

    private final AuthorityResourceRepository authorityResourceRepository;

//    private final AuthorityResourceSearchRepository authorityResourceSearchRepository;

     private final AuthorityResourceMapper authorityResourceMapper;



    public AuthorityResourceQueryService(AuthorityResourceRepository authorityResourceRepository,

			AuthorityResourceMapper authorityResourceMapper) {
		this.authorityResourceRepository = authorityResourceRepository;
//		this.authorityResourceSearchRepository = authorityResourceSearchRepository;
		this.authorityResourceMapper = authorityResourceMapper;
	}


    /**
     * Return a {@link List} of {%link AccountTypeDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
     @Transactional(readOnly = true)
    public List<AuthorityResourceDTO> findByCriteria(AuthorityResourceCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specifications<AuthorityResource> specification = createSpecification(criteria);
        return authorityResourceMapper.toDto(authorityResourceRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {%link AccountTypeDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<AuthorityResourceDTO> findByCriteria(AuthorityResourceCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specifications<AuthorityResource> specification = createSpecification(criteria);
        final Page<AuthorityResource> result = authorityResourceRepository.findAll(specification, page);
        return result.map(authorityResourceMapper::toDto);
    }
    /**
     * Function to convert AccountTypeCriteria to a {@link Specifications}
     */
    private Specifications<AuthorityResource> createSpecification(AuthorityResourceCriteria criteria) {
        Specifications<AuthorityResource> specification = Specifications.where(null);
        if (criteria != null) {
            /*if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), AuthorityResource_.id));
            }
            if (criteria.getAuthority()!= null) {
                specification = specification.and(buildStringSpecification(criteria.getAuthority(), AuthorityResource_.authority));
            }
            if (criteria.getRessourceId() != null) {
                specification = specification.and(buildReferringEntitySpecification(criteria.getRessourceId(),AuthorityResource_.ressource, Ressource_.id));
            }*/
        }
        return specification;
    }
}
