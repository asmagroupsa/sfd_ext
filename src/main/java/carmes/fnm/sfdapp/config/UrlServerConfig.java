package carmes.fnm.sfdapp.config;

public class UrlServerConfig {
	
	// static final String  BASE_URL="http://carmes.groupasma.com";
	static final String  BASE_URL="http://serviceinfos.ads-inter.com";
	static String SERVER="DEV";
	static String URL;
	public static String  urlEbss()
	{
		switch (SERVER) {
		case "DEV":URL=BASE_URL+":4002";break;
		case "LAB":URL=BASE_URL+":4001";break;
		case "PROD":URL=BASE_URL+":3000";break;
		default:URL=BASE_URL+":4002";break;
		}
		return URL;
	}

}
