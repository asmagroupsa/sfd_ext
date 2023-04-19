package carmes.fnm.sfdapp.repository;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


import carmes.fnm.sfdapp.util.Util;




public class UserRepositoryCustomImpl implements UserRepositoryCustom2{
	@PersistenceContext
    private EntityManager em;

	
}
