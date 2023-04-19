package carmes.fnm.sfdapp.web.rest;

import carmes.fnm.sfdapp.domain.CustomUser;
import carmes.fnm.sfdapp.domain.PersistentAuditEvent;
import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import carmes.fnm.sfdapp.repository.CustomUserRepository;
import carmes.fnm.sfdapp.repository.PersistenceAuditEventRepository;
import carmes.fnm.sfdapp.repository.UserRepository;
import carmes.fnm.sfdapp.security.jwt.JWTConfigurer;
import carmes.fnm.sfdapp.security.jwt.TokenProvider;
import carmes.fnm.sfdapp.web.rest.util.HeaderUtil;
import carmes.fnm.sfdapp.web.rest.vm.LoginVM;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.annotation.JsonProperty;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Controller to authenticate users.
 */
@RestController
@RequestMapping("/api")
public class UserJWTController {
    
	private static int tryNumber = 0;
    private final Logger log = LoggerFactory.getLogger(UserJWTController.class);

    private final TokenProvider tokenProvider;
    
    private final CustomUserRepository customUserRepository;

    private final AuthenticationManager authenticationManager;
    
    private final UserRepository userRepository;
    private final PersistenceAuditEventRepository persistenceAuditEventRepository;

    public UserJWTController(PersistenceAuditEventRepository persistenceAuditEventRepository, UserRepository userRepository,CustomUserRepository customUserRepository, TokenProvider tokenProvider, AuthenticationManager authenticationManager) {
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
        this.customUserRepository = customUserRepository;
        this.userRepository = userRepository;
        this.persistenceAuditEventRepository = persistenceAuditEventRepository;
    }

    @PostMapping("/authenticate")
    @Timed
    @Retryable(
            // retrying only when this custom exception is thrown
            //value=[RetryOnAPIFailureException::class], 
            maxAttempts = 2, // retrying up to 5 times
            backoff = @Backoff(delay = 30000)
        )
    public ResponseEntity authorize(@Valid @RequestBody LoginVM loginVM, HttpServletRequest request,HttpServletResponse response) {
    	
        UsernamePasswordAuthenticationToken authenticationToken =
            new UsernamePasswordAuthenticationToken(loginVM.getUsername(), loginVM.getPassword());
        String eventType = "";
        Map<String, String> results = new HashMap<>();
        try {
            
            Optional<User> userOptional = userRepository.findOneByLogin(loginVM.getUsername());
            if (userOptional.isPresent()) {
            	User user = userOptional.get();
            	TypeUser userType = user.getTypeUser();
            	if(null == userType ||(!loginVM.getUserTypes().contains(userType.toString()))) {
                	results.put("message", "N'est pas autorisé à se connecter sur la plateform");
                	results.put("type", userType.toString());
                	saveConnectionEvent(user.getLogin(), "NOT_AUTHORIZED_ON_PLATFORM", loginVM.getUserTypes().toString(), Instant.now(), results);
            		return ResponseEntity.badRequest()
                            .headers(HeaderUtil.createFailureAlert("AUTHENTIFICATION", "NOT_AUTHORIZED_ON_PLATFORM", "Non autorisé sur cette plateforme"))
                            .body("NOT_AUTHORIZED_ON_PLATFORM");
            	}
                
            } 
            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            boolean rememberMe = (loginVM.isRememberMe() == null) ? false : loginVM.isRememberMe();
            String jwt = tokenProvider.createToken(authentication, rememberMe);
            response.addHeader(JWTConfigurer.AUTHORIZATION_HEADER, "Bearer " + jwt);
            CustomUser customUser = customUserRepository.findByUserIsCurrentUser();
            if(null !=customUser){
            	int i = jwt.lastIndexOf('.');
    			String withoutSignature = jwt.substring(0, i+1);
    			Jwt<Header,Claims> untrusted = Jwts.parser().parseClaimsJwt(withoutSignature);
    			//Date exptime = untrusted.getBody().getExpiration();
    			Integer expDateSecond = (Integer)untrusted.getBody().get("exp");
            	log.debug("User principal o"+customUserRepository.findByUserIsCurrentUser().getCode()+expDateSecond);
                this.customUserRepository.setTokenExpDate(Instant.ofEpochSecond(expDateSecond), customUser.getId());
            }
            saveConnectionEvent(loginVM.getUsername(), "AUTHENTICATION_SUCCESS", loginVM.getUserTypes().toString(), Instant.now(), results);
        	
            return ResponseEntity.ok(new JWTToken(jwt));
        } catch (AuthenticationException ae) {
            log.trace("Authentication exception trace: {}", ae);

            String responseType = "";
            if(ae.getLocalizedMessage()=="Bad credentials") {
            	eventType = "AUTHENTICATION_BAD_CREDENTIAL";
            	responseType = "STATUS_BAD";
            }else if(ae.getLocalizedMessage().contains("was not activated")){
            	eventType = "AUTHENTICATION_NOT_ACTIVATE";
            	responseType = "STATUS_NOT_ACTIVATE";
            	
            }else {
            	
            	eventType = "AUTHENTICATION_EXCEPTION";
            	responseType = "AUTHENTICATION_EXCEPTION";
            }
            
        	results.put("message", ae.getLocalizedMessage());
        	results.put("type", ae.getClass().getCanonicalName());
            saveConnectionEvent(loginVM.getUsername(), eventType, loginVM.getUserTypes().toString(), Instant.now(), results);
        	
            return new ResponseEntity<>(Collections.singletonMap(responseType,
            		ae.getLocalizedMessage()), HttpStatus.UNAUTHORIZED);
        }
    }
    
    private void saveConnectionEvent(String principal, String type, String origin, Instant instant, Map<String, String> data) {
    	PersistentAuditEvent persistentAuditEvent = new PersistentAuditEvent();
        persistentAuditEvent.setPrincipal(principal);
        persistentAuditEvent.setAuditEventType(type);
        persistentAuditEvent.setAuditEventOrigin(origin);
        persistentAuditEvent.setAuditEventDate(instant);
        persistentAuditEvent.setData(data);
        persistenceAuditEventRepository.save(persistentAuditEvent);
    }

    /**
     * Object to return as body in JWT Authentication.
     */
    static class JWTToken {

        private String idToken;

        JWTToken(String idToken) {
            this.idToken = idToken;
        }

        @JsonProperty("id_token")
        String getIdToken() {
            return idToken;
        }

        void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
