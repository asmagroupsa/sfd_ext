package carmes.fnm.sfdapp.service;

import carmes.fnm.sfdapp.domain.AuthorityResource;
import carmes.fnm.sfdapp.domain.*;
import carmes.fnm.sfdapp.domain.Ressource;
import carmes.fnm.sfdapp.repository.RessourceRepository;
//import carmes.fnm.sfdapp.repository.search.RessourceSearchRepository;
import carmes.fnm.sfdapp.service.dto.CustomUserCriteria;
import carmes.fnm.sfdapp.service.dto.CustomUserDTO;
import carmes.fnm.sfdapp.service.dto.RessourceCriteria;
import carmes.fnm.sfdapp.service.dto.RessourceDTO;
import carmes.fnm.sfdapp.service.mapper.RessourceMapper;
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
public class RessourceQueryService extends QueryService<Ressource>{

    private final Logger log = LoggerFactory.getLogger(RessourceQueryService.class);

    private final RessourceRepository ressourceRepository;

    private final RessourceMapper ressourceMapper;

//    private final RessourceSearchRepository ressourceSearchRepository;



    public RessourceQueryService(RessourceRepository ressourceRepository, RessourceMapper ressourceMapper) {
        this.ressourceRepository = ressourceRepository;
        this.ressourceMapper = ressourceMapper;
//        this.ressourceSearchRepository = ressourceSearchRepository;

    }

    /**
     * Return a {@link List} of {%link AccountTypeDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<RessourceDTO> findByCriteria(RessourceCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specifications<Ressource> specification = createSpecification(criteria);
        return ressourceMapper.toDto(ressourceRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {%link AccountTypeDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<RessourceDTO> findByCriteria(RessourceCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specifications<Ressource> specification = createSpecification(criteria);
        final Page<Ressource> result = ressourceRepository.findAll(specification, page);
        return result.map(ressourceMapper::toDto);
    }
    /**
     * Function to convert AccountTypeCriteria to a {@link Specifications}
     */
    private Specifications<Ressource> createSpecification(RessourceCriteria criteria) {
        Specifications<Ressource> specification = Specifications.where(null);
        if (criteria != null) {
            if (criteria.getId()!= null) {
                specification = specification.and(buildSpecification(criteria.getId(), Ressource_.id));
            }
            if (criteria.getName()!= null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Ressource_.name));
            }
            if (criteria.getCode()!= null) {
                specification = specification.and(buildStringSpecification(criteria.getCode(), Ressource_.code));
            }
            if (criteria.getTypeUser() != null) {
                specification = specification.and(buildSpecification(criteria.getTypeUser(), Ressource_.typeUser));
            }
        }
        return specification;
    }
}
