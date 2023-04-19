package carmes.fnm.sfdapp.web.rest.util;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import carmes.fnm.sfdapp.config.UrlServerConfig;



public class MessageWhatsapp {
	
	public static void sendMessageWhatsapp(String compteCarmes, String message) throws JSONException {
       
		/*
		 *get info user 
		 * */
		RestTemplate template = new RestTemplate();
		MultiValueMap<String, String> postParams, postParams2;
		postParams = new LinkedMultiValueMap<>();
		
		postParams.set("cpte", compteCarmes);
		String resultat = template.postForObject(UrlServerConfig.urlEbss()+"/monnaies/infosCompteCarmesByCompte", postParams, String.class);
		String jOb = new JSONObject(resultat).getJSONArray("result").getJSONObject(0).getString("TEL_CPTE_CARTE_SMS");
		
		/*
		 * sent message Whatsapp
		 * */
		postParams2 = new LinkedMultiValueMap<>();
		postParams2.set("phone", jOb);
		postParams2.set("message", message);
		template.postForObject(UrlServerConfig.urlEbss()+"/message/send/text-whatsapp", postParams2, String.class);
		
	}

}
