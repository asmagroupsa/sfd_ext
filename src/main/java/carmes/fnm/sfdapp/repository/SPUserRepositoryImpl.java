package carmes.fnm.sfdapp.repository;
import java.sql.Date;
import java.time.Instant;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;


import carmes.fnm.sfdapp.util.Util;




public class SPUserRepositoryImpl implements SPUserRepository2{
	@PersistenceContext
    private EntityManager em;

	@Override
	public List<?>  listeRessource(Long user_id) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"listeRessource", "RessourceCodeInfo",
				new String[]{"user_id"},
				new Object[]{user_id},
				new Class[]{Long.class})
				.getResultList();
	}

	@Override
	public Object listeAutority(Long user_id) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"listeAutority", "ResultInfo",
				new String[]{"user_id"},
				new Object[]{user_id},
				new Class[]{Long.class})
				.getSingleResult();
	}

	@Override
	public Object listeRessourceAgenceReference(Long user_id) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"listeRessourceAgenceReference", "UserResourceAgenceInfo",
				new String[]{"user_id"},
				new Object[]{user_id},
				new Class[]{Long.class})
				.getSingleResult();
	}

	@Override
	public Object insertUser(Long id, String login, String password_hash, String first_name, String last_name,
			String email, String phone, String image_url, Boolean activated, String created_by,
			String chaine_authorities, String sfd_reference, String zone_reference, String agence_reference,
			String zone_sfd_ref, String type_user,String date_function, String date_end_function, String signature_url, String carte_url) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"insertUser", "ResultInfo",
				new String[]{"id","login","password_hash","first_name","last_name","email","phone","image_url","activated","created_by","chaine_authorities","sfd_reference","zone_reference","agence_reference","zone_sfd_ref","type_user","date_function","date_end_function", "signature_url","carte_url"},
				new Object[]{id,login,password_hash,first_name,last_name,email,phone,image_url,activated,created_by,chaine_authorities,sfd_reference,zone_reference,agence_reference, zone_sfd_ref,type_user,Util.strToDate(date_function),Util.strToDate(date_end_function), signature_url,carte_url},
				new Class[]{Long.class, String.class, String.class, String.class, String.class, String.class, String.class, String.class, Boolean.class, String.class, String.class, String.class, String.class, String.class, String.class, String.class, Date.class, Date.class, String.class, String.class})
				.getSingleResult();
	}

	@Override
	public Object insertAuthorityRessource(String authority, String chaineRessource) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"insertAuthorityRessource", "ResultInfo",
				new String[]{"authority","chaineRessource"},
				new Object[]{authority,chaineRessource},
				new Class[]{String.class, String.class})
				.getSingleResult();
	}

	@Override
	public List<?> listeRessourceAuthority(String authority, Boolean etat) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"listeRessourceAuthority", "RessourceInfo",
				new String[]{"authority","etat"},
				new Object[]{authority,etat},
				new Class[]{String.class, Boolean.class})
				.getResultList();
	}

	@Override
	public Object etatConnexion(Long user_id) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"etatConnexion", "ResultInfo",
				new String[]{"user_id"},
				new Object[]{user_id},
				new Class[]{Long.class})
				.getSingleResult();
	}

	@Override
	public Object connexion(Long user_id, Boolean etat) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"connexion", "ResultInfo",
				new String[]{"user_id","etat"},
				new Object[]{user_id,etat},
				new Class[]{Long.class, Boolean.class})
				.getSingleResult();
	}

	@Override
	public Object reConnexion(Long user_id) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"reConnexion", "ResultInfo",
				new String[]{"user_id"},
				new Object[]{user_id},
				new Class[]{Long.class})
				.getSingleResult();
	}

	@Override
	public Object reConnexionLogin(String login) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"reConnexionLogin", "ResultInfo",
				new String[]{"login"},
				new Object[]{login},
				new Class[]{String.class})
				.getSingleResult();
	}

	@Override
	public List<?> listeUtilisateur(String user_reference, String etat, String typeUser) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"listeUtilisateur", "UserInfo",
				new String[]{"user_reference","etat", "type_user"},
				new Object[]{user_reference,etat, typeUser},
				new Class[]{String.class, String.class, String.class})
				.getResultList();
	}

	@Override
	public Object souscription(Long id, String name, String typeclient, String comptecarmes, String tel, 
	String password_hash, String email, String code_guichet, String photo, String password, 
	String first_name, String denomination, Long district_id, String address, Double geo_long ,Double geo_lat) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"souscription", "ResultInfo",
				new String[]{"client_id", "name", "typeclient","comptecarmes", "tel", "password_hash", "email","code_guichet", "photo", "password", "first_name", "denomination", "district_id",  "address",  "geo_long" , "geo_lat"},
				new Object[]{id, name, typeclient,comptecarmes, tel, password_hash, email, code_guichet, photo, password,first_name,denomination, district_id,  address,  geo_long , geo_lat},
				new Class[]{Long.class, String.class,String.class,String.class, String.class,String.class, String.class, String.class, String.class, String.class, String.class, String.class   , Long.class, String.class, Double.class, Double.class})
				.getSingleResult();


	}

	@Override
	public List<?> utilisateurSfd(String sfd_reference) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"utilisateurSfd", "UserSFDInfo",
				new String[]{"sfd_reference"},
				new Object[]{sfd_reference},
				new Class[]{String.class})
				.getResultList();
	}

	@Override
	public Object annulationSouscription(String comptecarmes) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"annulationSouscription", "ResultInfo",
				new String[]{"comptecarmes"},
				new Object[]{comptecarmes},
				new Class[]{String.class})
				.getSingleResult();
	}

	@Override
	public Object annulationRessource(String authority, String ressource) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"annulationRessource", "ResultInfo",
				new String[]{"authority", "ressource"},
				new Object[]{authority, ressource},
				new Class[]{String.class, String.class})
				.getSingleResult();
	}

	@Override
	public Object addGuichetierSfd(Long id, String name, String first_name, String username, String tel, String password_hash, String email, String agence_reference, String created_by, String typeclient) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"add_guichetier_sfd", "ResultInfo",
				new String[]{"id","name", "first_name","username", "tel", "password_hash", "email","agence_reference", "created_by", "typeclient"},
				new Object[]{id,name, first_name,username, tel, password_hash, email, agence_reference, created_by, typeclient},
				new Class[]{Long.class, String.class,String.class,String.class, String.class,String.class, String.class, String.class, String.class, String.class})
				.getSingleResult();


	}

	@Override
	public List<?> listeUtilisateurParProfil(String authority, String agence_reference, int partner_id) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"listeUtilisateurParProfil", "ListeUtilisateurParProfilInfo",
				new String[]{"authority", "agence_reference", "partner_id"},
				new Object[]{authority, agence_reference, partner_id},
				new Class[]{String.class, String.class, int.class})
				.getResultList();
	}

	@Override
	public Object initialiserPassword(String login, String password_hash) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"initialiserPassword", "ResultInfo",
				new String[]{"login", "password_hash"},
				new Object[]{login, password_hash},
				new Class[]{String.class,String.class})
				.getSingleResult();


	}
	@Override
	public Object qrCodeSfdUserInfo(String sfd_reference) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"qrCodeSfdUserInfo", "QrCodeUserSFDInfo",
				new String[]{"sfd_reference"},
				new Object[]{sfd_reference},
				new Class[]{String.class})
				.getSingleResult();


	}
	
	@Override
	public Object qrCodeFnmUserInfo() {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"qrCodeFnmUserInfo", "QrCodeUserFNMInfo",
				new String[]{},
				new Object[]{},
				new Class[]{})
				.getSingleResult();


	}
	
	@Override
	public List<?> listeUtilisateurAgence(String agence_reference) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"listeUtilisateurAgence", "ListeUtilisateurAgenceInfo",
				new String[]{"agence_reference"},
				new Object[]{agence_reference},
				new Class[]{String.class})
				.getResultList();
	}

	
	@Override
	public Object sousSouscriptionBailleurSFD(String name, String address, String phone, String email, String fax, String bp, String city, 
											String created_by, String compte_carmes, String indice_prestataire, String logo, Long periodicity_id, 
											String acteur, String type_abonnement, String password_hash, int country_id) {
		// TODO Auto-generated method stub
		return  Util.getProcedure(em,
				"sousSouscriptionBailleurSFD", "ResultInfo",
				new String[]{"name","address","phone","email","fax","bp","city","created_by","compte_carmes","indice_prestataire","logo","periodicity_id","acteur","type_abonnement","password_hash", "country_id"},
				new Object[]{name,address,phone,email,fax,bp,city,created_by,compte_carmes,indice_prestataire,logo,periodicity_id,acteur,type_abonnement, password_hash, country_id},
				new Class[]{String.class, String.class, String.class, String.class, String.class, String.class, String.class, String.class, String.class, String.class, String.class, Long.class, String.class, String.class, String.class, int.class})
				.getSingleResult();
	}
}
