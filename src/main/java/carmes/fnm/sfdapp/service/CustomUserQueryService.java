package carmes.fnm.sfdapp.service;

import carmes.fnm.sfdapp.domain.AuthorityResource;
import carmes.fnm.sfdapp.domain.CustomUser;
import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.domain.*;
import carmes.fnm.sfdapp.repository.CustomUserRepository;
//import carmes.fnm.sfdapp.repository.search.CustomUserSearchRepository;
import carmes.fnm.sfdapp.service.dto.CustomUserCriteria;
import carmes.fnm.sfdapp.service.dto.CustomUserDTO;
import carmes.fnm.sfdapp.service.mapper.CustomUserMapper;
import io.github.jhipster.service.QueryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service Implementation for managing AuthorityResource.
 */
@Service
@Transactional(readOnly = true)
public class CustomUserQueryService extends QueryService<CustomUser>{

    private final Logger log = LoggerFactory.getLogger(CustomUserQueryService.class);

    private final CustomUserRepository customUserRepository;

    private final CustomUserMapper customUserMapper;

//    private final CustomUserSearchRepository customUserSearchRepository;



   public CustomUserQueryService(CustomUserRepository customUserRepository, CustomUserMapper customUserMapper) {
        this.customUserRepository = customUserRepository;

        this.customUserMapper = customUserMapper;
//        this.customUserSearchRepository = customUserSearchRepository;
    }

    /**
     * Return a {@link List} of {%link AccountTypeDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<CustomUserDTO> findByCriteria(CustomUserCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specifications<CustomUser> specification = createSpecification(criteria);
        return customUserMapper.toDto(customUserRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {%link AccountTypeDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<CustomUserDTO> findByCriteria(CustomUserCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specifications<CustomUser> specification = createSpecification(criteria);
        final Page<CustomUser> result = customUserRepository.findAll(specification, page);
        return result.map(customUserMapper::toDto);
    }
    /**
     * Function to convert AccountTypeCriteria to a {@link Specifications}
     */
    private Specifications<CustomUser> createSpecification(CustomUserCriteria criteria) {
        Specifications<CustomUser> specification = Specifications.where(null);
        if (criteria != null) {
            if (criteria.getCode()!= null) {
                specification = specification.and(buildStringSpecification(criteria.getCode(), CustomUser_.code));
            }
            if (criteria.getAgenceReference()!= null) {
                specification = specification.and(buildStringSpecification(criteria.getAgenceReference(), CustomUser_.agenceReference));
            }
            if (criteria.getSfdReference()!= null) {
                specification = specification.and(buildStringSpecification(criteria.getSfdReference(), CustomUser_.sfdReference));
            }
            if (criteria.getZoneReference()!= null) {
                specification = specification.and(buildStringSpecification(criteria.getZoneReference(), CustomUser_.zoneReference));
            }
            if (criteria.getTokenExpDate()!= null) {
                specification = specification.and(buildRangeSpecification(criteria.getTokenExpDate(), CustomUser_.tokenExpDate));
            }
            if (criteria.getConnecter()!= null) {
                specification = specification.and(buildSpecification(criteria.getConnecter(), CustomUser_.connecter));
            }
            if (criteria.getUserId() != null) {
                specification = specification.and(buildReferringEntitySpecification(criteria.getUserId(),CustomUser_.user, User_.id));
            }
        }
        return specification;
    }
}
