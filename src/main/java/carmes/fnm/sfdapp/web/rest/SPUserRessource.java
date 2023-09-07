package carmes.fnm.sfdapp.web.rest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.audit.AuditEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import carmes.fnm.sfdapp.domain.User;
import carmes.fnm.sfdapp.repository.UserRepository;
import carmes.fnm.sfdapp.service.SPUserService;
import carmes.fnm.sfdapp.util.ResultInfo;
import carmes.fnm.sfdapp.web.rest.util.MessageWhatsapp;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
// import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

@RestController
@RequestMapping("/api/user")
public class SPUserRessource{

	private final  String TAG = SPUserRessource.class.getSimpleName();
    private static final String ENTITY_NAME = "userManagement";

	 private final Logger log = LoggerFactory.getLogger(SPUserRessource.class);

	 private final SPUserService spUserService;
	 private final UserRepository userRepository;

	 public SPUserRessource(SPUserService spUserService,UserRepository userRepository) {
			this.spUserService = spUserService;
			this.userRepository = userRepository;
		}
	 @GetMapping("/liste-ressource")
		public List<?>  listeRessource(@RequestParam Long user_id) {
			return this.spUserService.listeRessource(user_id);
		}
	 @GetMapping("/liste-authority")
		public Object listeAutority(@RequestParam Long user_id) {
			// TODO Auto-generated method stub
			return  this.spUserService.listeAutority(user_id);
		}
	 
	 @GetMapping("/liste-ressource-agence")
		public Object listeRessourceAgenceReference(@RequestParam Long user_id) {
			// TODO Auto-generated method stub
			return  this.spUserService.listeRessourceAgenceReference(user_id);
		}
	 
	 @GetMapping("/insert-user")
		public Object insertUser(Long id, @RequestParam String login, String password_hash, @RequestParam String first_name, @RequestParam String last_name,
				@RequestParam String email, String phone,  String image_url, @RequestParam Boolean activated, @RequestParam String created_by,
				String chaine_authorities,  String sfd_reference,  String zone_reference, String agence_reference,
				String zone_sfd_ref, @RequestParam String typeUser,String date_function, String date_end_function, String signature_url, String carte_url, int country_id) {
			// TODO Auto-generated method stub

			log.debug("REST request to save User : {}", login);
			//User oldUser = userRepository.findOneByLogin(login);
	        // Lowercase the user login before comparing with database
			if (null == id){
				if (userRepository.findOneByLogin(login).isPresent()){
		            return new ResultInfo("loginexists");
		        }

				 if (userRepository.findOneByEmail(email).isPresent()) {
			        return new ResultInfo("emailexists");
			     }
			}else{
				Optional<User> userO = userRepository.findOneByLogin(login);
		        if (userO.isPresent()) {
		        	if(!userRepository.findOne(id).getLogin().equals(userO.get().getLogin()))
		        		return new ResultInfo("loginexists");

		        }

		        userO = userRepository.findOneByEmail(email);
		        if (userO.isPresent()) {
		        	if(!userRepository.findOne(id).getEmail().equals(userO.get().getEmail()))
		        		return new ResultInfo("emailexists");

		        }

			}


			return  this.spUserService.insertUser(id, login, password_hash, first_name, last_name, email, 
					phone, image_url, activated, created_by, chaine_authorities, sfd_reference, zone_reference, 
					agence_reference, zone_sfd_ref,typeUser, date_function, date_end_function, signature_url, carte_url, country_id);
		}
	 
	 @GetMapping("/insert-authority-ressource")
		public Object insertAuthorityRessource( @RequestParam String authority,  @RequestParam String chaineRessource) {
			// TODO Auto-generated method stub
			return  this.spUserService.insertAuthorityRessource(authority, chaineRessource);
		}
	 
	 @GetMapping("/liste-ressource-authority")
		public List<?> listeRessourceAuthority( @RequestParam String authority,  @RequestParam Boolean etat) {
			// TODO Auto-generated method stub
			return  this.spUserService.listeRessourceAuthority(authority, etat);
		}
	 @GetMapping("/etat-connexion")
		public Object etatConnexion(@RequestParam Long user_id) {
			// TODO Auto-generated method stub
			return  this.spUserService.etatConnexion(user_id);
		}
	 
	 @GetMapping("/connexion")
		public Object connexion(@RequestParam Long user_id, @RequestParam Boolean etat) {
			// TODO Auto-generated method stub
			return  this.spUserService.connexion(user_id, etat);
		}
	 
	 @GetMapping("/deconnecter")
		public Object reConnexion(Long user_id) {
			// TODO Auto-generated method stub
			return  this.spUserService.reConnexion(user_id);
		}

		@GetMapping("/deconnecter-by-login")
		public Object reConnexionLogin(@RequestParam String login) {
			// TODO Auto-generated method stub
			Object obj = this.spUserService.reConnexionLogin(login);
			return obj;
		}
		@GetMapping("/souscription")
		public Object souscription(Long id, @RequestParam String name, @RequestParam String typeclient, @RequestParam String comptecarmes, @RequestParam String tel, 
		String password, @RequestParam String email, String code_guichet,  @RequestParam String photo, String first_name, 
		String denomination, Long district_id, String address, Double geo_long ,Double geo_lat) {
			// TODO Auto-generated method stub

			if (userRepository.findOneByLogin(comptecarmes).isPresent()){
	            return new ResultInfo("loginexists");
	        }

			 if (userRepository.findOneByEmail(email).isPresent()) {
		        return new ResultInfo("emailexists");
		     }

			return this.spUserService.souscription(id, name, typeclient, comptecarmes, tel, password, email,code_guichet,photo,
			first_name,denomination, district_id,  address,  geo_long , geo_lat);
		}
		
		@GetMapping("/liste-utilisateurs-sfd")
		public List<?> utilisateurSfd(String sfd_reference) {
			// TODO Auto-generated method stub
			return  this.spUserService.utilisateurSfd(sfd_reference);
		}
		@GetMapping("/annulation-souscription")
		public Object annulationSouscription(String comptecarmes) {
			// TODO Auto-generated method stub
			return  this.spUserService.annulationSouscription(comptecarmes);
		}

		@GetMapping("/suppression-ressource-profil")
		public Object annulationRessource(@RequestParam String authority, @RequestParam String ressource) {
			// TODO Auto-generated method stub
			return  this.spUserService.annulationRessource(authority, ressource);
		}

		@GetMapping("/add-guichetier-sfd")
		public Object addGuichetierSfd(Long id, @RequestParam String name, @RequestParam String first_name, @RequestParam String username, @RequestParam String tel,
				@RequestParam String password_hash, @RequestParam String email, @RequestParam String agence_reference, @RequestParam String created_by, @RequestParam String profil_user) {
			// TODO Auto-generated method stub

			if (userRepository.findOneByLogin(username).isPresent()){
	            return new ResultInfo("loginexists");
	        }

			 if (userRepository.findOneByEmail(email).isPresent()) {
		        return new ResultInfo("emailexists");
		     }
			return  this.spUserService.addGuichetierSfd(id,name, first_name, username, tel, password_hash, email, agence_reference, created_by, profil_user);
		}
		
		@GetMapping("/liste-utilisateurs-profil")
		public List<?> listeUtilisateurParProfil(String authority, String agence_reference, int partner_id) {
			// TODO Auto-generated method stub
			return  this.spUserService.listeUtilisateurParProfil(authority, agence_reference, partner_id);
		}

		@GetMapping("/initialiser-password")
		public Object initialiserPassword(String login, String password_hash) {
			// TODO Auto-generated method stub
			Object obj=  this.spUserService.initialiserPassword(login, password_hash);
			return obj;
		}
		
		@GetMapping("/qr-code-sfd-user-info")
		public Object qrCodeSfdUserInfo(@RequestParam String sfd_reference) {
			// TODO Auto-generated method stub
			return  this.spUserService.qrCodeSfdUserInfo(sfd_reference);
		}
		@GetMapping("/qr-code-fnm-user-info")
		public Object qrCodeFnmUserInfo() {
			// TODO Auto-generated method stub
			return this.spUserService.qrCodeFnmUserInfo();
		}
		
		@GetMapping("/liste-utilisateur-agence")
		public List<?> listeUtilisateurAgence(String agence_reference) {
			// TODO Auto-generated method stub
			return  this.spUserService.listeUtilisateurAgence(agence_reference);
		}
		
		   @GetMapping(params = {"principal","after"})
		    public List<AuditEvent> findByPrincipalAndAuditEventDateAfter(
		    	@RequestParam(value = "principal") String login,
		        @RequestParam(value = "after") LocalDate after) {

		    	/*List<AuditEvent> auditEvents = auditEventService.findByPrincipalAndAuditEventDateAfter(
		    			login,
		    			after.atStartOfDay(ZoneId.systemDefault()).toInstant()
		    			);*/
		        return null;
		    }
			@GetMapping("/liste-utilisateurs")
			public List<?> listeUtilisateur(String user_reference, String etat, String typeUser) {
				// TODO Auto-generated method stub
				return  this.spUserService.listeUtilisateur(user_reference, etat, typeUser);
			}
			@GetMapping("/souscription-complet")
			public ResultInfo souscriptionComplet(Long id, @RequestParam String name, @RequestParam String typeclient, @RequestParam String comptecarmes,
					@RequestParam String tel, String password, @RequestParam String email, String pin, String code_guichet, @RequestParam String photo, 
					String first_name, String denomination, Long district_id, String address, Double geo_long ,Double geo_lat) {
				if (null == id){
					if (userRepository.findOneByLogin(comptecarmes).isPresent()){
			            return new ResultInfo("loginexists");
			        }

					 if (userRepository.findOneByEmail(email).isPresent()) {
				        return new ResultInfo("emailexists");
				     }
				}else{
					
			        Optional<User> userO = userRepository.findOneByEmail(email);
			        if (userO.isPresent()) {
			        	if(!(userRepository.findOneByLogin(comptecarmes).get())
			        			.getEmail().equals(userO.get().getEmail()))
			        		return new ResultInfo("emailexists");

			        }

				}
				
				ResultInfo resultat=  (ResultInfo)this.spUserService.souscription(id, name, typeclient, comptecarmes, tel, password, 
						email,code_guichet,photo,first_name,denomination, district_id,  address,  geo_long , geo_lat);
						
						if(!typeclient.equals("MASTER")) {
							if(resultat.getResultat().equals("OK") && null == id){
								/*
								ClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory(HttpClients.createDefault());
								RestTemplate restTemplate = new RestTemplate(requestFactory);
								try{
								   MultiValueMap<String, String> postParams = new LinkedMultiValueMap<>();
								   postParams.set("compteClient", comptecarmes);
								   postParams.set("action", "fraisguichet");
								   postParams.set("pinClient", pin);
								   postParams.set("montantFraisGuichet", 0+"");
					
									String resulttext = restTemplate.postForObject(CARMES_HOST + "/carte_puce/appSms.php", postParams, String.class);
									//CarmesResultInfo result = restTemplate.getForObject(CARMES_HOST + "/web/appSolde.php?usrAccount="+comptecarmes+"&usrPin="+pin, CarmesResultInfo.class);
									log.debug("result: "+resulttext);
									//resulttext = resulttext.substring(resulttext.indexOf('{'));
									CarmesResultInfo result = new ObjectMapper().readValue(resulttext, CarmesResultInfo.class);
									String message = result.getMessage();
									//log.debug("result: "+message.toLowerCase());
									if (message != null && message.equals("OK")) {
										//System.out.println("result: "+message);
										return resultat;
					                }else {
					                	this.spUserService.annulationSouscription(comptecarmes);
										return new ResultInfo(jsonObj.getString("message"));
					                }
								} catch (Exception e1) {
									e1.printStackTrace();
									this.spUserService.annulationSouscription(comptecarmes);
									return new ResultInfo("ERROR_REQUEST_CARMES");
								}*/

							}
						}

				
				return resultat;
			}
			
			@ApiOperation(value = "Afficher la liste des demandes des clients", response = ResultInfo.class)
		    @GetMapping("/souscription-bailleur-sfd")
		    public Object sousSouscriptionBailleurSFD(    
		        @ApiParam(value = "La date debut") String name, 
		        @ApiParam(value = "La date de fin") String address,
		        @ApiParam(value = "Nom du client") String phone,
		        @ApiParam(value = "Etude préalable (1:etudierPrealable| 0: Non etudierPreablable") String email,
		        @ApiParam(value = "Etude detaillée (1:etudierDetaille| 0: Non etudierDetaille") String fax,
		        @ApiParam(value = "Comité (1:comiter| 0: non comiter)") String bp,
		        @ApiParam(value = "Notifier (1:notifier| 0:non notifier)") String city,
		        @ApiParam(value = "Garanite (1:garantisser| 0: non garantisser)") String created_by,
		        @ApiParam(value = "former (1:former| 0:non former)") String compte_carmes,
		        @ApiParam(value = "La reference du user") String indice_prestataire,
		        @ApiParam(value = "Etude préalable (1:etudierPrealable| 0: Non etudierPreablable") String logo,
		        @ApiParam(value = "Etude detaillée (1:etudierDetaille| 0: Non etudierDetaille") Long periodicity_id,
		        @ApiParam(value = "Comité (1:comiter| 0: non comiter)") String acteur,
		        @ApiParam(value = "Notifier (1:notifier| 0:non notifier)") String type_abonnement,
		        @ApiParam(value = "Notifier (1:notifier| 0:non notifier)") String password, int country_id) throws JSONException {
		        // TODO Auto-generated method stub

				ResultInfo r = (ResultInfo) this.spUserService.sousSouscriptionBailleurSFD(name, address, phone, email, fax, bp, city, created_by, compte_carmes, indice_prestataire, logo, periodicity_id, acteur, type_abonnement, password, country_id);
		        //String password_hash = passwordEncoder.encode(password);
				if(r.getResultat()=="OK") {
					String message = "FELICITATION VOUS ETES "+acteur.toUpperCase()+" SUR NOTRE PLATEFORME.\nVEUILLEZ VOUS CONNECTER POUR LA SUITE DES OPERATION.";
					MessageWhatsapp.sendMessageWhatsapp(compte_carmes, message);
				}
				
		        System.out.println("MOT DE PASSE =>"+ password);
		        return r;
		    }
			
}
