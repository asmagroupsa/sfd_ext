package carmes.fnm.sfdapp.service;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import carmes.fnm.sfdapp.repository.SPUserRepository;
import carmes.fnm.sfdapp.repository.UserRepository;
import carmes.fnm.sfdapp.util.Util;



@Service
@Transactional
public class SPUserService {

	private final Logger log = LoggerFactory.getLogger(SPUserService.class);
    private final SPUserRepository spUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;


    public SPUserService(UserRepository userRepository,SPUserRepository spUserRepository, PasswordEncoder passwordEncoder) {
        this.spUserRepository = spUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }


    public List<?>  listeRessource(Long user_id) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.listeRessource(user_id);
	}

	public Object listeAutority(Long user_id) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.listeAutority(user_id);
	}

	public Object listeRessourceAgenceReference(Long user_id) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.listeRessourceAgenceReference(user_id);
	}

	public Object insertUser(Long id, String login, String password_hash, String first_name, String last_name,
			String email, String phone, String image_url, Boolean activated, String created_by,
			String chaine_authorities, String sfd_reference, String zone_reference, String agence_reference,
			String zone_sfd_ref, String type_user,String date_function, String date_end_function, String signature_url, String carte_url) {
		// TODO Auto-generated method stub

		password_hash =null != password_hash ? passwordEncoder.encode(password_hash):null;
		return  this.spUserRepository.insertUser(id, login, password_hash, first_name, last_name, email, phone, image_url, activated, 
				created_by, chaine_authorities, sfd_reference, zone_reference, agence_reference, zone_sfd_ref, 
				type_user, date_function, date_end_function, signature_url,carte_url);
	}

	public Object insertAuthorityRessource(String authority, String chaineRessource) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.insertAuthorityRessource(authority, chaineRessource);
	}

	public List<?> listeRessourceAuthority(String authority, Boolean etat) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.listeRessourceAuthority(authority, etat);
	}

	public Object etatConnexion(Long user_id) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.etatConnexion(user_id);
	}

	public Object connexion(Long user_id, Boolean etat) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.connexion(user_id, etat);
	}

	public Object reConnexion(Long user_id) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.reConnexion(user_id);
	}

	public Object reConnexionLogin(String login) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.reConnexionLogin(login);
	}

	public List<?> listeUtilisateur(String user_reference, String etat, String typeUser) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.listeUtilisateur(user_reference, etat, typeUser);
	}

	public Object souscription(Long id, String name, String typeclient, String comptecarmes, String tel, 
	String password_hash, String email, String code_guichet, String photo, String first_name, 
	String denomination, Long district_id, String address, Double geo_long ,Double geo_lat) {
		// TODO Auto-generated method stub
		String password=null;
		if(typeclient.equals("MASTER")) {
			password= Util.codeGenerator();
			password_hash=passwordEncoder.encode(password);

		}else {
			password_hash =null != password_hash ? passwordEncoder.encode(password_hash):null;
		}
		log.debug("Password+++++++++++++++++++++++++"+" " +password+" "+password_hash);
		return this.spUserRepository.souscription(id,name, typeclient, comptecarmes, tel, password_hash, email,code_guichet, 
		photo, password, first_name, denomination, district_id,  address,  geo_long , geo_lat);
	}

	public List<?> utilisateurSfd(String sfd_reference) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.utilisateurSfd(sfd_reference);
	}

	public Object annulationSouscription(String comptecarmes) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.annulationSouscription(comptecarmes);
	}

	public Object annulationRessource(String authority, String ressource) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.annulationRessource(authority, ressource);
	}

	public Object addGuichetierSfd(Long id, String name, String first_name, String username, String tel, String password_hash, String email, String agence_reference, String created_by, String typeclient) {
		// TODO Auto-generated method stub
		password_hash =null != password_hash ? passwordEncoder.encode(password_hash):null;
		return  this.spUserRepository.addGuichetierSfd(id, name, first_name, username, tel, password_hash, email, agence_reference, created_by, typeclient);
	}

	public List<?> listeUtilisateurParProfil(String authority, String agence_reference, int partner_id) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.listeUtilisateurParProfil(authority, agence_reference, partner_id);
	}

	public Object initialiserPassword(String login, String password_hash) {
		// TODO Auto-generated method stub
		password_hash =null != password_hash ? passwordEncoder.encode(password_hash):null;
		Object obj= this.spUserRepository.initialiserPassword(login, password_hash);
		userRepository.findOneByLogin(login).ifPresent(user -> {
            //user.setFirstConnection(true);
            log.debug("firstConnection User: {}", user);
           
        });
		
		return obj;
		
	}
	
	public Object qrCodeSfdUserInfo(String sfd_reference) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.qrCodeSfdUserInfo(sfd_reference);


	}
	
	public Object qrCodeFnmUserInfo() {
		// TODO Auto-generated method stub
		return this.spUserRepository.qrCodeFnmUserInfo();
	}

	public List<?> listeUtilisateurAgence(String agence_reference) {
		// TODO Auto-generated method stub
		return  this.spUserRepository.listeUtilisateurAgence(agence_reference);
	}
	
	public Object sousSouscriptionBailleurSFD(String name, String address, String phone, String email, String fax, String bp, String city, String created_by, String compte_carmes, String indice_prestataire, String logo, Long periodicity_id, String acteur, String type_abonnement, String password_hash)
	 {
		String passwordHash = passwordEncoder.encode(password_hash);
		System.out.println("MOT DE PASSE HASHER =>"+ passwordHash);
		// TODO Auto-generated method stub
		return this.spUserRepository.sousSouscriptionBailleurSFD(name, address, phone, email, fax, bp, city, created_by, compte_carmes, indice_prestataire, logo, periodicity_id, acteur, type_abonnement, passwordHash);
	}
}
