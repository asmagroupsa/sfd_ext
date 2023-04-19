package carmes.fnm.sfdapp.config;
import java.sql.Connection;

import javax.sql.DataSource;

import org.apache.commons.dbcp2.BasicDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import carmes.fnm.sfdapp.SfdApp;

@Configuration
public class DataSourceConfig {
	 private static final Logger log = LoggerFactory.getLogger(SfdApp.class);

	 private Environment env;

   /* @Bean
    @Primary
    @ConfigurationProperties(prefix = "datasource.primary")
    public DataSource primaryDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean
    @ConfigurationProperties(prefix = "datasource.secondary")
    public DataSource secondaryDataSource() {
        return DataSourceBuilder.create().build();
    }
    
    @Bean
    @Primary
    //@ConfigurationProperties(prefix = "datasource.primary")
    public DataSource primaryDataSource() {
    	BasicDataSource ds;
    	log.info("ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
    	try {
    		ds = new BasicDataSource();
	        ds.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	        ds.setUrl("jdbc:sqlserver://dev.groupasma.local;database=sfdDBnew");
	        ds.setUsername("carmes");
	        ds.setPassword("C@rm&s_B@s&_D&v***");
    		//Connection con =  ds.getConnection();
    		//con.close();
		} catch (Exception e) {
			// TODO: handle exception
			
			//ds = secondaryDataSource();
			
			ds = new BasicDataSource();
	        ds.setDriverClassName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
	        ds.setUrl("jdbc:sqlserver://dev.groupasma.local;database=sfdDBnew");
	        ds.setUsername("fnm");
	        ds.setPassword("c@rmes@2017@**");
	        log.info("Exception conection\noooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo");

	        return ds;
			
		}
    	
        return ds;
    }*/
}

