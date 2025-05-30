package carmes.fnm.sfdapp.service.util;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.EntityManager;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureQuery;

import com.hazelcast.com.eclipsesource.json.ParseException;
public class Util {
	
	// public static <T> StoredProcedureQuery getProcedure(EntityManager em, String nameProcedure, String nameMap,  String [] keys, T[] valeurs, Class [] types){
	// 	StoredProcedureQuery storedProcedure;
	// 	if(null == nameMap){
	// 		storedProcedure = em.createStoredProcedureQuery(nameProcedure);
	// 	}else{
	// 		storedProcedure = em.createStoredProcedureQuery(nameProcedure,nameMap);
	// 	}
		
	// 	for (int i = 0; i < keys.length; i++) {
	// 		storedProcedure.registerStoredProcedureParameter(keys[i], types[i], ParameterMode.IN);
	// 		storedProcedure.setParameter(keys[i], valeurs[i]);
			 
	// 	}
	// 	return storedProcedure;
	// }
	
	public static Date strToDate(String datestr){
		try {
		    SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy");
		    return null == datestr ? null : df.parse(datestr);
		    //System.out.println(date);
		} catch (ParseException | java.text.ParseException exp) {
		    exp.printStackTrace();
		    return null;
		}
		//return null;
	}
	
	public static String codeGenerator()
    {
       String caractere = "abcdefghijklmnopqrstuvwxyz1234567890";
       int caractereLength = caractere.length();
	   StringBuilder  code = new StringBuilder (caractereLength);
       for(int x=0;x<8;x++)
	    {
	       int i = (int) (Math.random() * caractereLength);
            code.append(caractere.charAt(i));
	    }
        return code.toString();
    }


}
