package carmes.fnm.sfdapp.service;

import carmes.fnm.sfdapp.config.Constants;
import carmes.fnm.sfdapp.domain.Authority;
import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.domain.*;
import carmes.fnm.sfdapp.repository.AuthorityRepository;
import carmes.fnm.sfdapp.repository.UserRepository;
//import carmes.fnm.sfdapp.repository.search.UserSearchRepository;
import carmes.fnm.sfdapp.service.dto.AuthorityCriteria;
import carmes.fnm.sfdapp.service.dto.AuthorityDTO;
import carmes.fnm.sfdapp.service.dto.UserCriteria;
import carmes.fnm.sfdapp.service.dto.UserDTO;
import carmes.fnm.sfdapp.service.mapper.AuthorityMapper;
import io.github.jhipster.service.QueryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specifications;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class UserQueryService extends QueryService<User> {
    private final Logger log = LoggerFactory.getLogger(UserQueryService.class);

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

//    private final UserSearchRepository userSearchRepository;

    private final AuthorityRepository authorityRepository;

    public UserQueryService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthorityRepository authorityRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
//        this.userSearchRepository = userSearchRepository;
        this.authorityRepository = authorityRepository;
    }

    /**
     * Return a {@link List} of {%link ActiveurDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    /*@Transactional(readOnly = true)
    public List<UserDTO> findByCriteria(UserCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specifications<User> specification = createSpecification(criteria);
        return userRepository.findAll(specification).map(UserDTO::new);
    }*/

    /**
     * Return a {@link Page} of {%link ActiveurDTO} which matches the criteria from the database
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<UserDTO> findByCriteria(UserCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specifications<User> specification = createSpecification(criteria);
        final Page<User> result = userRepository.findAll(specification, page);
        return result.map(UserDTO::new);
    }

    /**
     * Function to convert ActiveurCriteria to a {@link Specifications}
     */
    private Specifications<User> createSpecification(UserCriteria criteria) {
        Specifications<User> specification = Specifications.where(null);
        if (criteria != null) {
            if (criteria.getLogin() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLogin(), User_.login));
            }
            if (criteria.getFirstName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getFirstName(), User_.firstName));
            }
            if (criteria.getLastName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLastName(), User_.lastName));
            }
            if (criteria.getEmail() != null) {
                specification = specification.and(buildStringSpecification(criteria.getEmail(), User_.email));
            }
            if (criteria.getImageUrl() != null) {
                specification = specification.and(buildStringSpecification(criteria.getImageUrl(), User_.imageUrl));
            }
            if (criteria.getLangKey() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLangKey(), User_.langKey));
            }
            if (criteria.getCreatedBy() != null) {
                specification = specification.and(buildStringSpecification(criteria.getCreatedBy(), User_.createdBy));
            }
            if (criteria.getCreatedDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreatedDate(), User_.createdDate));
            }
            if (criteria.getLastModifiedBy() != null) {
                specification = specification.and(buildStringSpecification(criteria.getLastModifiedBy(), User_.lastModifiedBy));
            }
            if (criteria.getLastModifiedDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getLastModifiedDate(), User_.lastModifiedDate));
            }
//            if (criteria.getAuthoritiesId() != null) {
//                specification = specification.and(buildReferringEntitySpecification(criteria.getAuthoritiesId(),User_.authorities, Authority_.name));
//            }
            if (criteria.getTypeUser() != null) {
                specification = specification.and(buildSpecification(criteria.getTypeUser(), User_.typeUser));
            }
        }
        return specification;
    }
}
