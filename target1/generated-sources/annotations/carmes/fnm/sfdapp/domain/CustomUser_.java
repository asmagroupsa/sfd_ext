package carmes.fnm.sfdapp.domain;

import java.time.Instant;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(CustomUser.class)
public abstract class CustomUser_ {

	public static volatile SingularAttribute<CustomUser, String> sfdReference;
	public static volatile SingularAttribute<CustomUser, String> code;
	public static volatile SingularAttribute<CustomUser, String> agenceReference;
	public static volatile SingularAttribute<CustomUser, Long> id;
	public static volatile SingularAttribute<CustomUser, Instant> tokenExpDate;
	public static volatile SingularAttribute<CustomUser, String> zoneReference;
	public static volatile SingularAttribute<CustomUser, User> user;
	public static volatile SingularAttribute<CustomUser, Boolean> connecter;

}

