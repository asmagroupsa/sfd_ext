package carmes.fnm.sfdapp.domain;

import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(User.class)
public abstract class User_ extends carmes.fnm.sfdapp.domain.AbstractAuditingEntity_ {

	public static volatile SingularAttribute<User, String> lastName;
	public static volatile SingularAttribute<User, Instant> resetDate;
	public static volatile SingularAttribute<User, String> signatureUrl;
	public static volatile SingularAttribute<User, Instant> dateEndFunction;
	public static volatile SingularAttribute<User, String> login;
	public static volatile SingularAttribute<User, String> activationKey;
	public static volatile SingularAttribute<User, String> resetKey;
	public static volatile SetAttribute<User, Authority> authorities;
	public static volatile SingularAttribute<User, Boolean> firstConnection;
	public static volatile SingularAttribute<User, String> firstName;
	public static volatile SingularAttribute<User, String> password;
	public static volatile SingularAttribute<User, String> langKey;
	public static volatile SingularAttribute<User, TypeUser> typeUser;
	public static volatile SingularAttribute<User, String> imageUrl;
	public static volatile SingularAttribute<User, Long> id;
	public static volatile SingularAttribute<User, Instant> dateFunction;
	public static volatile SingularAttribute<User, String> email;
	public static volatile SingularAttribute<User, Boolean> activated;

}

