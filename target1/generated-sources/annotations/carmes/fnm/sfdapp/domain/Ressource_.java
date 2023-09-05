package carmes.fnm.sfdapp.domain;

import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(Ressource.class)
public abstract class Ressource_ {

	public static volatile SingularAttribute<Ressource, String> code;
	public static volatile SingularAttribute<Ressource, TypeUser> typeUser;
	public static volatile SingularAttribute<Ressource, String> name;
	public static volatile SetAttribute<Ressource, AuthorityResource> authorityResources;
	public static volatile SingularAttribute<Ressource, Long> id;

}

