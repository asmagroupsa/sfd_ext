package carmes.fnm.sfdapp.security;

import carmes.fnm.sfdapp.domain.PersistentAuditEvent;
import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.repository.PersistenceAuditEventRepository;
import carmes.fnm.sfdapp.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);

    private final UserRepository userRepository;
    private final PersistenceAuditEventRepository persistenceAuditEventRepository;

    public DomainUserDetailsService(PersistenceAuditEventRepository persistenceAuditEventRepository,UserRepository userRepository) {
        this.userRepository = userRepository;
        this.persistenceAuditEventRepository = persistenceAuditEventRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {
        log.debug("Authenticating {}", login);
        String lowercaseLogin = login.toLowerCase(Locale.ENGLISH);
        Optional<User> userFromDatabase = userRepository.findOneWithAuthoritiesByLogin(lowercaseLogin);
        return userFromDatabase.map(user -> {
            if (!user.getActivated()) {
            	
                throw new UserNotActivatedException("User " + lowercaseLogin + " was not activated");
            }
            
            log.debug("user.getAuthorities() {}", user.getAuthorities());
            List<GrantedAuthority> grantedAuthorities = user.getAuthorities().stream()
                    .map(authority -> new SimpleGrantedAuthority(authority.getName()))
                .collect(Collectors.toList());
            return new org.springframework.security.core.userdetails.User(lowercaseLogin,
                user.getPassword(),
                grantedAuthorities);
        }).orElseThrow(() -> new UsernameNotFoundException("User " + lowercaseLogin + " was not found in the " +
        "database"));
    }
    
    
    private void saveConnectionEvent(String principal, String type, Instant instant, Map<String, String> data) {
    	PersistentAuditEvent persistentAuditEvent = new PersistentAuditEvent();
        persistentAuditEvent.setPrincipal(principal);
        persistentAuditEvent.setAuditEventType(type);
        persistentAuditEvent.setAuditEventDate(instant);
        persistentAuditEvent.setData(data);
        persistenceAuditEventRepository.save(persistentAuditEvent);
    }
}
