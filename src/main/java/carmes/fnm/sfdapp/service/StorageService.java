package carmes.fnm.sfdapp.service;

import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import carmes.fnm.sfdapp.service.util.Util;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;


@Service
@Transactional
public class StorageService {

	Logger log = LoggerFactory.getLogger(this.getClass().getName());
	private final Path rootLocation = Paths.get("uploads");



	public StorageService() {

	}

	public String store(MultipartFile file)throws RuntimeException{
		String extension = FilenameUtils.getExtension(file.getOriginalFilename());
		String name = file.getOriginalFilename();
		name = name.toLowerCase(Locale.ENGLISH);
		name = name.replaceAll("\\s","");
		//String fileName = name.substring(0,  Math.min(name.length(), 10))+"-"+System.currentTimeMillis()+"."+(null !=extension && !extension.equals("")?extension:"png");
		
		String fileName = "sfd_"+Util.codeGenerator()+"-"+System.currentTimeMillis()+"."+(null !=extension && !extension.equals("")?extension:"png");
		try {
            Files.copy(file.getInputStream(), this.rootLocation.resolve(fileName));
        } catch (Exception e) {
        	throw new RuntimeException("FAIL!");
        }

		return fileName;
	}

    public String storeSfd(MultipartFile file)throws RuntimeException{
		String extension = FilenameUtils.getExtension(file.getOriginalFilename());
		String name = file.getOriginalFilename();
		name = name.toLowerCase(Locale.ENGLISH);
		name = name.replaceAll("\\s","");
		//String fileName = name.substring(0,  Math.min(name.length(), 10))+"-"+System.currentTimeMillis()+"."+(null !=extension && !extension.equals("")?extension:"png");
		
		String fileName = "ads_"+Util.codeGenerator()+"-"+System.currentTimeMillis()+"."+(null !=extension && !extension.equals("")?extension:"jpg");
		try {
            Files.copy(file.getInputStream(), this.rootLocation.resolve(fileName));
        } catch (Exception e) {
        	throw new RuntimeException("FAIL!");
        }

		return fileName;
	}

    public Resource loadFile(String filename){
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if(resource.exists() || resource.isReadable()) {
                return resource;
            }else{
            	return null;
            }
        } catch (MalformedURLException e) {
        	return null;
        }
        
        
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage!");
        }
    }

}
