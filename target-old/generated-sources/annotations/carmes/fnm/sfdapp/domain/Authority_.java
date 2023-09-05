package carmes.fnm.sfdapp.domain;

import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import javax.annotation.Generated;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Authority.class)
public abstract class Authority_ {

	public static volatile SingularAttribute<Authority, String> nextLigneRequest;
	public static volatile SingularAttribute<Authority, TypeUser> typeUser;
	public static volatile SingularAttribute<Authority, String> name;
	public static volatile SingularAttribute<Authority, String> description;
	public static volatile SingularAttribute<Authority, Long> partnerId;

}

