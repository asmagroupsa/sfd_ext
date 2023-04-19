package carmes.fnm.sfdapp.service;

import carmes.fnm.sfdapp.domain.Ressource;
import carmes.fnm.sfdapp.repository.RessourceRepository;
//import carmes.fnm.sfdapp.repository.search.RessourceSearchRepository;
import carmes.fnm.sfdapp.service.dto.RessourceDTO;
import carmes.fnm.sfdapp.service.mapper.RessourceMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



/**
 * Service Implementation for managing Ressource.
 */
@Service
@Transactional
public class RessourceService {

    private final Logger log = LoggerFactory.getLogger(RessourceService.class);

    private final RessourceRepository ressourceRepository;

    private final RessourceMapper ressourceMapper;

//    private final RessourceSearchRepository ressourceSearchRepository;

    public RessourceService(RessourceRepository ressourceRepository, RessourceMapper ressourceMapper) {
        this.ressourceRepository = ressourceRepository;
        this.ressourceMapper = ressourceMapper;
//        this.ressourceSearchRepository = ressourceSearchRepository;
    }

    /**
     * Save a ressource.
     *
     * @param ressourceDTO the entity to save
     * @return the persisted entity
     */
    public RessourceDTO save(RessourceDTO ressourceDTO) {
        log.debug("Request to save Ressource : {}", ressourceDTO);
        Ressource ressource = ressourceMapper.toEntity(ressourceDTO);
        ressource = ressourceRepository.save(ressource);
        RessourceDTO result = ressourceMapper.toDto(ressource);
//        ressourceSearchRepository.save(ressource);
        return null;
    }

    /**
     *  Get all the ressources.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<RessourceDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Ressources");
        return ressourceRepository.findAll(pageable)
            .map(ressourceMapper::toDto);
    }

    /**
     *  Get one ressource by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Transactional(readOnly = true)
    public RessourceDTO findOne(Long id) {
        log.debug("Request to get Ressource : {}", id);
        Ressource ressource = ressourceRepository.findOne(id);
        return ressourceMapper.toDto(ressource);
    }

    /**
     *  Delete the  ressource by id.
     *
     *  @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Ressource : {}", id);
        ressourceRepository.delete(id);
//        ressourceSearchRepository.delete(id);
    }

    /**
     * Search for the ressource corresponding to the query.
     *
     *  @param query the query of the search
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<RessourceDTO> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Ressources for query {}", query);
//        Page<Ressource> result = ressourceSearchRepository.search(queryStringQuery(query), pageable);
        return null;
    }
}
