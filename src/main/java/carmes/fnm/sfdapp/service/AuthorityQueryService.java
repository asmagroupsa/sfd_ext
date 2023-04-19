package carmes.fnm.sfdapp.service;

import carmes.fnm.sfdapp.domain.Authority;
import carmes.fnm.sfdapp.repository.AuthorityRepository;
import carmes.fnm.sfdapp.service.dto.AuthorityCriteria;
import carmes.fnm.sfdapp.service.dto.AuthorityDTO;
import carmes.fnm.sfdapp.service.mapper.AuthorityMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import io.github.jhipster.service.QueryService;
import carmes.fnm.sfdapp.domain.*;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AuthorityQueryService extends QueryService<Authority> {
    private final Logger log = LoggerFactory.getLogger(AuthorityQueryService.class);

    private final AuthorityRepository authorityRepository;

    private final AuthorityMapper authorityMapper;

//    //private final AuthoritySearchRepository authoritySearchRepository;

    public AuthorityQueryService(AuthorityRepository authorityRepository, AuthorityMapper authorityMapper) {
        this.authorityRepository = authorityRepository;
        this.authorityMapper = authorityMapper;
    }

    /**
     * Return a {@link List} of {%link ActiveurDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    /*@Transactional(readOnly = true)
    public List<AuthorityDTO> findByCriteria(AuthorityCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specifications<Authority> specification = createSpecification(criteria);
        return authorityRepository.findAll(specification).map(AuthorityDTO::new);
    }*/

    /**
     * Return a {@link Page} of {%link ActiveurDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<AuthorityDTO> findByCriteria(AuthorityCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specifications<Authority> specification = createSpecification(criteria);
        final Page<Authority> result = authorityRepository.findAll(specification, page);
        return result.map(AuthorityDTO::new);
    }

    /**
     * Function to convert ActiveurCriteria to a {@link Specifications}
     */
    private Specifications<Authority> createSpecification(AuthorityCriteria criteria) {
        Specifications<Authority> specification = Specifications.where(null);
        if (criteria != null) {
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Authority_.name));
            }
            if (criteria.getDescription() != null) {
                specification = specification.and(buildStringSpecification(criteria.getDescription(), Authority_.description));
            }
            if (criteria.getTypeUser() != null) {
                specification = specification.and(buildSpecification(criteria.getTypeUser(), Authority_.typeUser));
            }
            if (criteria.getNextLigneRequest() != null) {
                specification = specification.and(buildStringSpecification(criteria.getNextLigneRequest(), Authority_.nextLigneRequest));
            }
            if (criteria.getPartnerId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getPartnerId(), Authority_.partnerId));
            }
        }
        return specification;
    }
}
