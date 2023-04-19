package carmes.fnm.sfdapp.web.rest;

import carmes.fnm.sfdapp.service.RessourceQueryService;
import carmes.fnm.sfdapp.service.dto.RessourceCriteria;
import com.codahale.metrics.annotation.Timed;
import carmes.fnm.sfdapp.service.RessourceService;
import carmes.fnm.sfdapp.web.rest.util.HeaderUtil;
import carmes.fnm.sfdapp.web.rest.util.PaginationUtil;
import carmes.fnm.sfdapp.service.dto.RessourceDTO;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

//import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Ressource.
 */
@RestController
@RequestMapping("/api")
public class RessourceResource {

    private final Logger log = LoggerFactory.getLogger(RessourceResource.class);

    private static final String ENTITY_NAME = "ressource";

    private final RessourceService ressourceService;
    private final RessourceQueryService ressourceQueryService;

    public RessourceResource(RessourceService ressourceService, RessourceQueryService ressourceQueryService) {
        this.ressourceService = ressourceService;
        this.ressourceQueryService = ressourceQueryService;
    }

    /**
     * POST  /ressources : Create a new ressource.
     *
     * @param ressourceDTO the ressourceDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new ressourceDTO, or with status 400 (Bad Request) if the ressource has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/ressources")
    @Timed
    public ResponseEntity<RessourceDTO> createRessource(@Valid @RequestBody RessourceDTO ressourceDTO) throws URISyntaxException {
        log.debug("REST request to save Ressource : {}", ressourceDTO);
        if (ressourceDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new ressource cannot already have an ID")).body(null);
        }
        RessourceDTO result = ressourceService.save(ressourceDTO);
        return ResponseEntity.created(new URI("/api/ressources/" + ressourceDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, ressourceDTO.getId()+""))
            .body(result);
    }

    /**
     * PUT  /ressources : Updates an existing ressource.
     *
     * @param ressourceDTO the ressourceDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated ressourceDTO,
     * or with status 400 (Bad Request) if the ressourceDTO is not valid,
     * or with status 500 (Internal Server Error) if the ressourceDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/ressources")
    @Timed
    public ResponseEntity<RessourceDTO> updateRessource(@Valid @RequestBody RessourceDTO ressourceDTO) throws URISyntaxException {
        log.debug("REST request to update Ressource : {}", ressourceDTO);
        if (ressourceDTO.getId() == null) {
            return createRessource(ressourceDTO);
        }
        RessourceDTO result = ressourceService.save(ressourceDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, ressourceDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /ressources : get all the ressources.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of ressources in body
     */
    @GetMapping("/ressources")
    @Timed
    public ResponseEntity<List<RessourceDTO>> getAllRessources(RessourceCriteria criteria, @ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Ressources");
        Page<RessourceDTO> page = ressourceQueryService.findByCriteria(criteria,pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/ressources");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /ressources/:id : get the "id" ressource.
     *
     * @param id the id of the ressourceDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the ressourceDTO, or with status 404 (Not Found)
     */
    @GetMapping("/ressources/{id}")
    @Timed
    public ResponseEntity<RessourceDTO> getRessource(@PathVariable Long id) {
        log.debug("REST request to get Ressource : {}", id);
        RessourceDTO ressourceDTO = ressourceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(ressourceDTO));
    }

    /**
     * DELETE  /ressources/:id : delete the "id" ressource.
     *
     * @param id the id of the ressourceDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/ressources/{id}")
    @Timed
    public ResponseEntity<Void> deleteRessource(@PathVariable Long id) {
        log.debug("REST request to delete Ressource : {}", id);
        ressourceService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/ressources?query=:query : search for the ressource corresponding
     * to the query.
     *
     * @param query the query of the ressource search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/ressources")
    @Timed
    public ResponseEntity<List<RessourceDTO>> searchRessources(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of Ressources for query {}", query);
        Page<RessourceDTO> page = ressourceService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/ressources");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
