package carmes.fnm.sfdapp.web.rest;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import carmes.fnm.sfdapp.service.StorageService;;



@RestController
@RequestMapping("/api/files")
public class FileUploadResource {


		@Autowired
		public final StorageService storageService;

		List<String> files = new ArrayList<String>();



		public FileUploadResource(StorageService storageService) {

			this.storageService = storageService;
		}

		@GetMapping("/")
		public String listUploadedFiles(Model model) {
			return "uploadForm";
		}

		@PostMapping("/")
		public String handleFileUpload(@RequestParam("file") MultipartFile file, Model model) {
			try {
				if (!file.isEmpty()) {
					String fileName = storageService.store(file);
					model.addAttribute("message", "You successfully uploaded " + file.getOriginalFilename() + "!");
					files.add(file.getOriginalFilename());

					//String fileName = file.getOriginalFilename();

					//Resource fileResource = storageService.loadFile(fileName);
					return fileName;
				} else {
					model.addAttribute("message", "Failed to upload " + file.getOriginalFilename() + " because it was empty");
			    }
			} catch (Exception e) {
				model.addAttribute("message", "FAIL to upload " + file.getOriginalFilename() + "!");
			}
			return "ECHEC";
		}

		@PostMapping("/fileupload")
		public String handleFileUploadSfd(@RequestParam("file") MultipartFile file, Model model) {
			try {
				if (!file.isEmpty()) {
					String fileName = storageService.storeSfd(file);
					model.addAttribute("message", "You successfully uploaded " + file.getOriginalFilename() + "!");
					files.add(file.getOriginalFilename());

					//String fileName = file.getOriginalFilename();

					//Resource fileResource = storageService.loadFile(fileName);
					return fileName;
				} else {
					model.addAttribute("message", "Failed to upload " + file.getOriginalFilename() + " because it was empty");
			    }
			} catch (Exception e) {
				model.addAttribute("message", "FAIL to upload " + file.getOriginalFilename() + "!");
			}
			return "ECHEC";
		}

		@GetMapping("/all")
		public String getListFiles(Model model) {
			model.addAttribute("files",
					files.stream()
							.map(fileName -> MvcUriComponentsBuilder
									.fromMethodName(FileUploadResource.class, "getFile", fileName).build().toString())
							.collect(Collectors.toList()));
			model.addAttribute("totalFiles", "TotalFiles: " + files.size());
			return "listFiles";
		}

		@GetMapping("/{filename:.+}")
		@ResponseBody
		public ResponseEntity<byte[]> getFile(@PathVariable String filename) {

			try {
				Resource file = storageService.loadFile(filename);
				if(null != file) {
					return ResponseEntity.ok()
							.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
							.body(Base64.encodeBase64(FileUtils.readFileToByteArray(file.getFile())));
				}else {
					return null;
				}
			} catch (Exception e) {
				// TODO Auto-generated catch block
				return null;
			}


		}
}

