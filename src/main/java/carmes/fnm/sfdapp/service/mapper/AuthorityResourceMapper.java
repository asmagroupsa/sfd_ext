package carmes.fnm.sfdapp.service.mapper;

import carmes.fnm.sfdapp.domain.*;
import carmes.fnm.sfdapp.service.dto.AuthorityResourceDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity AuthorityResource and its DTO AuthorityResourceDTO.
 */
@Mapper(componentModel = "spring", uses = {RessourceMapper.class, })
public interface AuthorityResourceMapper extends EntityMapper <AuthorityResourceDTO, AuthorityResource> {

    @Mapping(source = "ressource.id", target = "ressourceId")
    AuthorityResourceDTO toDto(AuthorityResource authorityResource); 

    @Mapping(source = "ressourceId", target = "ressource")
    AuthorityResource toEntity(AuthorityResourceDTO authorityResourceDTO); 
    default AuthorityResource fromId(Long id) {
        if (id == null) {
            return null;
        }
        AuthorityResource authorityResource = new AuthorityResource();
        authorityResource.setId(id);
        return authorityResource;
    }
}
