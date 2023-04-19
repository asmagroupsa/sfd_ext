package carmes.fnm.sfdapp.service.mapper;

import carmes.fnm.sfdapp.domain.*;
import carmes.fnm.sfdapp.service.dto.RessourceDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity Ressource and its DTO RessourceDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface RessourceMapper extends EntityMapper <RessourceDTO, Ressource> {
    
    @Mapping(target = "authorityResources", ignore = true)
    Ressource toEntity(RessourceDTO ressourceDTO); 
    default Ressource fromId(Long id) {
        if (id == null) {
            return null;
        }
        Ressource ressource = new Ressource();
        ressource.setId(id);
        return ressource;
    }
}
