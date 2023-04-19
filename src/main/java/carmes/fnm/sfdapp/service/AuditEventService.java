package carmes.fnm.sfdapp.service;

import carmes.fnm.sfdapp.config.audit.AuditEventConverter;
import carmes.fnm.sfdapp.domain.PersistentAuditEvent;
import carmes.fnm.sfdapp.repository.PersistenceAuditEventRepository;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing audit events.
 * <p>
 * This is the default implementation to support SpringBoot Actuator AuditEventRepository
 * </p>
 */
@Service
@Transactional
public class AuditEventService {

    private final PersistenceAuditEventRepository persistenceAuditEventRepository;

    private final AuditEventConverter auditEventConverter;

    public AuditEventService(
        PersistenceAuditEventRepository persistenceAuditEventRepository,
        AuditEventConverter auditEventConverter) {

        this.persistenceAuditEventRepository = persistenceAuditEventRepository;
        this.auditEventConverter = auditEventConverter;
    }

    public Page<PersistentAuditEvent> findAll(Pageable pageable) {
        return persistenceAuditEventRepository.findAll(pageable)
            .map(auditEventConverter::convertToPersistentAuditEvent);
    }
    
    public Page<PersistentAuditEvent> findAll(String origin, Pageable pageable) {
        return persistenceAuditEventRepository.findAllByAuditEventOriginContaining(origin, pageable)
            .map(auditEventConverter::convertToPersistentAuditEvent);
    }

    public Page<PersistentAuditEvent> findByDates(Instant fromDate, Instant toDate,String origin, Pageable pageable) {
        return persistenceAuditEventRepository.findAllByAuditEventDateBetweenAndAuditEventOriginContaining(fromDate, toDate,origin, pageable)
            .map(auditEventConverter::convertToPersistentAuditEvent);
    }
    
    public Page<PersistentAuditEvent> findByDates(Instant fromDate, Instant toDate, Pageable pageable) {
        return persistenceAuditEventRepository.findAllByAuditEventDateBetween(fromDate, toDate, pageable)
            .map(auditEventConverter::convertToPersistentAuditEvent);
    }
    
    public List<PersistentAuditEvent> findByPrincipal(String principal) {
    	List<PersistentAuditEvent> persistentAuditEvents = persistenceAuditEventRepository.findByPrincipal(principal);
        return auditEventConverter.convertToPersistentAuditEvent(persistentAuditEvents);	
    }
    
    public List<PersistentAuditEvent> findByAuditEventDateAfter(Instant after) {
    	List<PersistentAuditEvent> persistentAuditEvents = persistenceAuditEventRepository.findByAuditEventDateAfter(after);
        return auditEventConverter.convertToPersistentAuditEvent(persistentAuditEvents);	
    }
    public List<PersistentAuditEvent> findByAuditEventDateAfter(Instant after, String origin) {
    	List<PersistentAuditEvent> persistentAuditEvents = persistenceAuditEventRepository.findByAuditEventDateAfterAndAuditEventOriginContaining(after, origin);
        return auditEventConverter.convertToPersistentAuditEvent(persistentAuditEvents);	
    }
    
    public List<PersistentAuditEvent> findByPrincipalAndAuditEventDateAfter(String principal, Instant after) {
    	List<PersistentAuditEvent> persistentAuditEvents = persistenceAuditEventRepository.findByPrincipalAndAuditEventDateAfter(principal, after);
        return auditEventConverter.convertToPersistentAuditEvent(persistentAuditEvents);	
    }

    public List<PersistentAuditEvent> findByPrincipalAndAuditEventDateAfterAndAuditEventType(String principal, Instant after, String type) {
    	List<PersistentAuditEvent> persistentAuditEvents = persistenceAuditEventRepository.findByPrincipalAndAuditEventDateAfterAndAuditEventType(principal, after, type);
        return auditEventConverter.convertToPersistentAuditEvent(persistentAuditEvents);	
    }

    public Optional<AuditEvent> find(Long id) {
        return Optional.ofNullable(persistenceAuditEventRepository.findOne(id)).map
            (auditEventConverter::convertToAuditEvent);
    }
}
