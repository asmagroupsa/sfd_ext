package carmes.fnm.sfdapp.web.rest;

import carmes.fnm.sfdapp.domain.PersistentAuditEvent;
import carmes.fnm.sfdapp.service.AuditEventService;
import carmes.fnm.sfdapp.web.rest.util.PaginationUtil;

import io.github.jhipster.web.util.ResponseUtil;
import io.swagger.annotations.ApiParam;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

/**
 * REST controller for getting the audit events.
 */
@RestController
@RequestMapping("/audits/users/connections/events")
public class AuditUserResource {

    private final AuditEventService auditEventService;

    public AuditUserResource(AuditEventService auditEventService) {
        this.auditEventService = auditEventService;
    }

    /**
     * GET  /audits : get a page of AuditEvents.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of AuditEvents in body
     */
    @GetMapping
    public ResponseEntity<List<PersistentAuditEvent>> getAll(@ApiParam Pageable pageable) {
        Page<PersistentAuditEvent> page = auditEventService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/audits/users/connections/events");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping(params = {"origin"})
    public ResponseEntity<List<PersistentAuditEvent>> getAll(String origin, @ApiParam Pageable pageable) {
        Page<PersistentAuditEvent> page = auditEventService.findAll(origin,pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/audits/users/connections/events");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /audits : get a page of AuditEvents between the fromDate and toDate.
     *
     * @param fromDate the start of the time period of AuditEvents to get
     * @param toDate the end of the time period of AuditEvents to get
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of AuditEvents in body
     */
    @GetMapping(params = {"fromDate", "toDate"})
    public ResponseEntity<List<PersistentAuditEvent>> getByDates(
        @RequestParam(value = "fromDate") LocalDate fromDate,
        @RequestParam(value = "toDate") LocalDate toDate,
        @ApiParam Pageable pageable) {

        Page<PersistentAuditEvent> page = auditEventService.findByDates(
            fromDate.atStartOfDay(ZoneId.systemDefault()).toInstant(),
            toDate.atStartOfDay(ZoneId.systemDefault()).plusDays(1).toInstant(),
            pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/audits/users/connections/events");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping(params = {"fromDate", "toDate", "origin"})
    public ResponseEntity<List<PersistentAuditEvent>> getByDates(
        @RequestParam(value = "fromDate") LocalDate fromDate,
        @RequestParam(value = "origin") String origin,
        @RequestParam(value = "toDate") LocalDate toDate,
        @ApiParam Pageable pageable) {

        Page<PersistentAuditEvent> page = auditEventService.findByDates(
            fromDate.atStartOfDay(ZoneId.systemDefault()).toInstant(),
            toDate.atStartOfDay(ZoneId.systemDefault()).plusDays(1).toInstant(),
            origin,
            pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/audits/users/connections/events");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }
    
    @GetMapping(params = {"principal"})
    public ResponseEntity<List<PersistentAuditEvent>> findByPrincipal(
        @RequestParam(value = "principal") String login) {

    	List<PersistentAuditEvent> auditEvents = auditEventService.findByPrincipal(login);
        return new ResponseEntity<>(auditEvents, HttpStatus.OK);
    }
    
    
    
    
    
    @GetMapping(params = {"principal","after", "type"})
    public ResponseEntity<List<PersistentAuditEvent>> findByPrincipalAndAuditEventDateAfterAndAuditEventType(
    	@RequestParam(value = "principal") String login,
        @RequestParam(value = "after") LocalDate after,
        @RequestParam(value = "type") String type) {

    	List<PersistentAuditEvent> auditEvents = auditEventService.findByPrincipalAndAuditEventDateAfterAndAuditEventType(
    			login,
    			after.atStartOfDay(ZoneId.systemDefault()).toInstant(),
    			type
    			);
        return new ResponseEntity<>(auditEvents, HttpStatus.OK);
    }
    
    
    
    
    @GetMapping(params = {"principal","after"})
    public ResponseEntity<List<PersistentAuditEvent>> findByPrincipalAndAuditEventDateAfter(
    	@RequestParam(value = "principal") String login,
        @RequestParam(value = "after") LocalDate after) {

    	List<PersistentAuditEvent> auditEvents = auditEventService.findByPrincipalAndAuditEventDateAfter(
    			login,
    			after.atStartOfDay(ZoneId.systemDefault()).toInstant()
    			);
        return new ResponseEntity<>(auditEvents, HttpStatus.OK);
    }
    
    
    
    
    @GetMapping(params = {"after"})
    public ResponseEntity<List<PersistentAuditEvent>> findByAuditEventDateAfter(
        @RequestParam(value = "after") LocalDate after) {

    	List<PersistentAuditEvent> auditEvents = auditEventService.findByAuditEventDateAfter(
    			after.atStartOfDay(ZoneId.systemDefault()).toInstant()
    			);
        return new ResponseEntity<>(auditEvents, HttpStatus.OK);
    }
    
    @GetMapping(params = {"after", "origin"})
    public ResponseEntity<List<PersistentAuditEvent>> findByAuditEventDateAfter(
        @RequestParam(value = "after") LocalDate after,
        @RequestParam(value = "origin") String origin) {

    	List<PersistentAuditEvent> auditEvents = auditEventService.findByAuditEventDateAfter(
    			after.atStartOfDay(ZoneId.systemDefault()).toInstant(),
    			origin
    			);
        return new ResponseEntity<>(auditEvents, HttpStatus.OK);
    }
    

    /**
     * GET  /audits/:id : get an AuditEvent by id.
     *
     * @param id the id of the entity to get
     * @return the ResponseEntity with status 200 (OK) and the AuditEvent in body, or status 404 (Not Found)
     */
    @GetMapping("/{id:.+}")
    public ResponseEntity<AuditEvent> get(@PathVariable Long id) {
        return ResponseUtil.wrapOrNotFound(auditEventService.find(id));
    }
}
