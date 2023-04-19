package carmes.fnm.sfdapp.web.rest;

import carmes.fnm.sfdapp.service.AuthorityQueryService;
import carmes.fnm.sfdapp.service.dto.AuthorityCriteria;
import com.codahale.metrics.annotation.Timed;
import carmes.fnm.sfdapp.service.AuthorityService;
import carmes.fnm.sfdapp.web.rest.util.HeaderUtil;
import carmes.fnm.sfdapp.web.rest.util.PaginationUtil;
import carmes.fnm.sfdapp.service.dto.AuthorityDTO;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;

import org.apache.http.auth.AUTH;
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
 * REST controller for managing Authority.
 */
@RestController
@RequestMapping("/api")
public class AuthorityResource {

    private final Logger log = LoggerFactory.getLogger(AuthorityResource.class);

    private static final String ENTITY_NAME = "authority";

    private final AuthorityService authorityService;
    private final AuthorityQueryService authorityQueryService;

    public AuthorityResource(AuthorityService authorityService, AuthorityQueryService authorityQueryService) {
        this.authorityService = authorityService;
        this.authorityQueryService = authorityQueryService;
    }

    /**
     * POST  /authoritys : Create a new authority.
     *
     * @param authorityDTO the authorityDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new authorityDTO, or with status 400 (Bad Request) if the authority has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/authoritys")
    @Timed
    public ResponseEntity<AuthorityDTO> createAuthority(@Valid @RequestBody AuthorityDTO authorityDTO) throws URISyntaxException {
        log.debug("REST request to save Authority : {}", authorityDTO);
        AuthorityDTO role = authorityService.findOne(authorityDTO.getName());
        if (role != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new authority cannot already have an ID")).body(null);
        }
        AuthorityDTO result = authorityService.save(authorityDTO);
        return ResponseEntity.created(new URI("/api/authoritys/" + authorityDTO.getName()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME,  authorityDTO.getName().toString()))
            .body(result);
    }

    /**
     * PUT  /authoritys : Updates an existing authority.
     *
     * @param authorityDTO the authorityDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated authorityDTO,
     * or with status 400 (Bad Request) if the authorityDTO is not valid,
     * or with status 500 (Internal Server Error) if the authorityDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/authoritys")
    @Timed
    public ResponseEntity<AuthorityDTO> updateAuthority(@Valid @RequestBody AuthorityDTO authorityDTO) throws URISyntaxException {
        log.debug("REST request to update Authority : {}", authorityDTO);
        if (authorityDTO.getName() == null) {
            return createAuthority(authorityDTO);
        }
        AuthorityDTO result = authorityService.save(authorityDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, authorityDTO.getName().toString()))
            .body(result);
    }

    /**
     * GET  /authoritys : get all the authoritys.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of authoritys in body
     */
    @GetMapping("/authoritys")
    @Timed
    public ResponseEntity<List<AuthorityDTO>> getAllAuthoritys(AuthorityCriteria criteria, @ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Authoritys by criteria:", criteria);
        Page<AuthorityDTO> page = authorityQueryService.findByCriteria(criteria,pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/authoritys");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /authoritys/:id : get the "id" authority.
     *
     * @param name the name of the authorityDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the authorityDTO, or with status 404 (Not Found)
     */
    @GetMapping("/authoritys/{id}")
    @Timed
    public ResponseEntity<AuthorityDTO> getAuthority(@PathVariable String name) {
        log.debug("REST request to get Authority : {}", name);
        AuthorityDTO authorityDTO = authorityService.findOne(name);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(authorityDTO));
    }

    /**
     * DELETE  /authoritys/:id : delete the "id" authority.
     *
     * @param name the name of the authorityDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/authoritys/{name}")
    @Timed
    public ResponseEntity<Void> deleteAuthority(@PathVariable String name) {
        log.debug("REST request to delete Authority : {}", name);
        authorityService.delete(name);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, name.toString())).build();
    }

    /**
     * SEARCH  /_search/authoritys?query=:query : search for the authority corresponding
     * to the query.
     *
     * @param query the query of the authority search
     * @param pageable the pagination information
     * @return the result of the search
     */
   /* @GetMapping("/_search/authoritys")
    @Timed
    public ResponseEntity<List<AuthorityDTO>> searchAuthoritys(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of Authoritys for query {}", query);
        Page<AuthorityDTO> page = authorityService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/authoritys");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }*/

    @GetMapping("/authoritys/nextlignerequest-update")
    @Timed
    public ResponseEntity<AuthorityDTO> nextLigneRequestUpdate(@RequestParam String name, @RequestParam String valeur, @RequestParam String action){

        AuthorityDTO result = authorityService.nextLigneRequestUpdate(name, valeur, action);
        return ResponseEntity.ok()
            .body(result);
    }

}
