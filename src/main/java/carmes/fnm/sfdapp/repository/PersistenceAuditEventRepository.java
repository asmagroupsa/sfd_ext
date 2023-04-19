package carmes.fnm.sfdapp.repository;

import carmes.fnm.sfdapp.domain.PersistentAuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

/**
 * Spring Data JPA repository for the PersistentAuditEvent entity.
 */
public interface PersistenceAuditEventRepository extends JpaRepository<PersistentAuditEvent, Long> {

    List<PersistentAuditEvent> findByPrincipal(String principal);

    List<PersistentAuditEvent> findByAuditEventDateAfter(Instant after);
    List<PersistentAuditEvent> findByAuditEventDateAfterAndAuditEventOriginContaining(Instant after, String str);
    List<PersistentAuditEvent> findByPrincipalAndAuditEventDateAfter(String principal, Instant after);

    List<PersistentAuditEvent> findByPrincipalAndAuditEventDateAfterAndAuditEventType(String principle, Instant after, String type);

    Page<PersistentAuditEvent> findAllByAuditEventDateBetween(Instant fromDate, Instant toDate, Pageable pageable);
    Page<PersistentAuditEvent> findAllByAuditEventDateBetweenAndAuditEventOriginContaining(Instant fromDate, Instant toDate, String str, Pageable pageable);
    Page<PersistentAuditEvent> findAllByAuditEventOriginContaining(String str, Pageable pageable);

}
