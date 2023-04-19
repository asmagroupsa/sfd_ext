package carmes.fnm.sfdapp.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import carmes.fnm.sfdapp.service.AuthorityResourceQueryService;
import carmes.fnm.sfdapp.service.dto.AuthorityResourceCriteria;
import carmes.fnm.sfdapp.service.dto.AuthorityResourceDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;

import carmes.fnm.sfdapp.domain.AuthorityResource;
import carmes.fnm.sfdapp.service.AuthorityResourceService;
import carmes.fnm.sfdapp.web.rest.util.HeaderUtil;
import carmes.fnm.sfdapp.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;

/**
 * REST controller for managing AuthorityResource.
 */
@RestController
@RequestMapping("/api")
public class AuthorityResourceResource {

    private final Logger log = LoggerFactory.getLogger(AuthorityResourceResource.class);

    private static final String ENTITY_NAME = "authorityResource";

    private final AuthorityResourceService authorityResourceService;
    private final AuthorityResourceQueryService authorityResourceQueryService;

    public AuthorityResourceResource(AuthorityResourceService authorityResourceService, AuthorityResourceQueryService authorityResourceQueryService) {
        this.authorityResourceService = authorityResourceService;
        this.authorityResourceQueryService = authorityResourceQueryService;
    }

    /**
     * POST  /authority-resources : Create a new authorityResource.
     *
     * @param authorityResource the authorityResource to create
     * @return the ResponseEntity with status 201 (Created) and with body the new authorityResource, or with status 400 (Bad Request) if the authorityResource has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/authority-resources")
    @Timed
    public ResponseEntity<AuthorityResource> createAuthorityResource(@Valid @RequestBody AuthorityResource authorityResource) throws URISyntaxException {
        log.debug("REST request to save AuthorityResource : {}", authorityResource);
        if (authorityResource.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new authorityResource cannot already have an ID")).body(null);
        }
        AuthorityResource result = authorityResourceService.save(authorityResource);
        return ResponseEntity.created(new URI("/api/authority-resources/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /authority-resources : Updates an existing authorityResource.
     *
     * @param authorityResource the authorityResource to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated authorityResource,
     * or with status 400 (Bad Request) if the authorityResource is not valid,
     * or with status 500 (Internal Server Error) if the authorityResource couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/authority-resources")
    @Timed
    public ResponseEntity<AuthorityResource> updateAuthorityResource(@Valid @RequestBody AuthorityResource authorityResource) throws URISyntaxException {
        log.debug("REST request to update AuthorityResource : {}", authorityResource);
        if (authorityResource.getId() == null) {
            return createAuthorityResource(authorityResource);
        }
        AuthorityResource result = authorityResourceService.save(authorityResource);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, authorityResource.getId().toString()))
            .body(result);
    }

    /**
     * GET  /authority-resources : get all the authorityResources.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of authorityResources in body
     */
    @GetMapping("/authority-resources")
    @Timed
    public ResponseEntity<List<AuthorityResourceDTO>> getAllAuthorityResources(AuthorityResourceCriteria criteria, @ApiParam Pageable pageable) {
        log.debug("REST request to get a page of AuthorityResources by criteria:", criteria);
        Page<AuthorityResourceDTO> page = authorityResourceQueryService.findByCriteria(criteria, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/authority-resources");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /authority-resources/:id : get the "id" authorityResource.
     *
     * @param id the id of the authorityResource to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the authorityResource, or with status 404 (Not Found)
     */
    @GetMapping("/authority-resources/{id}")
    @Timed
    public ResponseEntity<AuthorityResource> getAuthorityResource(@PathVariable Long id) {
        log.debug("REST request to get AuthorityResource : {}", id);
        AuthorityResource authorityResource = authorityResourceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(authorityResource));
    }

    /**
     * DELETE  /authority-resources/:id : delete the "id" authorityResource.
     *
     * @param id the id of the authorityResource to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/authority-resources/{id}")
    @Timed
    public ResponseEntity<Void> deleteAuthorityResource(@PathVariable Long id) {
        log.debug("REST request to delete AuthorityResource : {}", id);
        authorityResourceService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/authority-resources?query=:query : search for the authorityResource corresponding
     * to the query.
     *
     * @param query the query of the authorityResource search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/authority-resources")
    @Timed
    public ResponseEntity<List<AuthorityResource>> searchAuthorityResources(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of AuthorityResources for query {}", query);
        Page<AuthorityResource> page = authorityResourceService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/authority-resources");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
