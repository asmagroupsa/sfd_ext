package carmes.fnm.sfdapp.security;

import org.springframework.security.core.AuthenticationException;

/**
 * This exception is thrown in case of a not activated user trying to authenticate.
 */
public class UserNotAuthorizedOnPlatformException extends AuthenticationException {

    private static final long serialVersionUID = 1L;

    public UserNotAuthorizedOnPlatformException(String message) {
        super(message);
    }

    public UserNotAuthorizedOnPlatformException(String message, Throwable t) {
        super(message, t);
    }
}
