package carmes.fnm.sfdapp.repository;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Repository;

@SuppressWarnings("unused")
@Repository
public interface SPUserRepository2{
	public List<?>  listeRessource(Long user_id );
	public Object listeAutority(Long user_id);
	public Object listeRessourceAgenceReference(Long user_id );
	public Object insertUser(Long id,  String login, String password_hash, String first_name,
			 String last_name, String email,String phone , String image_url, Boolean activated,
			 String created_by, String chaine_authorities, String sfd_reference,
			 String zone_reference, String agence_reference,String zone_sfd_ref, String type_user, 
			 String date_function, String date_end_function, String signature_url, String carte_url, int country_id);

	public Object etatConnexion(Long user_id);
	public Object connexion(Long user_id, Boolean etat);
	public Object reConnexion(Long user_id);
	public Object reConnexionLogin(String login);
	public Object insertAuthorityRessource(String authority, String chaineRessource);
	public List<?> listeRessourceAuthority(String authority, Boolean etat);
	public List<?> listeUtilisateur(String user_reference, String etat, String typeUser);
	public List<?> utilisateurSfd(String sfd_reference);
	public Object souscription(Long id, String name, String typeclient, String comptecarmes, String tel, 
	String password_hash, String email, String code_guichet, String photo, String password, 
	String first_name, String denomination, Long district_id, String address, Double geo_long ,Double geo_lat);
	public Object annulationSouscription(String comptecarmes);

	public Object annulationRessource(String authority, String ressource);

	public Object addGuichetierSfd(Long id, String name, String first_name, String username, String tel, String password_hash, String email, String agence_reference, String created_by, String typeclient);

	public List<?> listeUtilisateurParProfil(String authority, String agence_reference, int partner_id);

	public Object initialiserPassword(String login, String password_hash);
	
	public Object qrCodeSfdUserInfo(String sfd_reference);
	
	public Object qrCodeFnmUserInfo();
	
	public List<?> listeUtilisateurAgence(String agence_reference);
	
	public Object sousSouscriptionBailleurSFD(String name, String address, String phone, String email, 
			String fax, String bp, String city, String created_by, String compte_carmes, String indice_prestataire, 
			String logo, Long periodicity_id, String acteur, String type_abonnement, String password_hash, int country_id);
}
