package carmes.fnm.sfdapp.service.mapper;

import carmes.fnm.sfdapp.domain.*;
import carmes.fnm.sfdapp.service.dto.AuthorityDTO;
import carmes.fnm.sfdapp.service.dto.UserDTO;

import java.util.Set;

import org.mapstruct.*;
import org.springframework.stereotype.Service;

/**
 * Mapper for the entity Authority and its DTO AuthorityDTO.
 */
@Service
public class AuthorityMapper{

    /*default Authority fromName(String id) {
        if (id == null) {
            return null;
        }
        Authority authority = new Authority();
        authority.setName(id);
        return authority;
    }*/

    public Authority authorityDTOToAuthority(AuthorityDTO authorityDTO) {
        if (authorityDTO == null) {
            return null;
        } else {
        	Authority authority = new Authority();
        	authority.setName(authorityDTO.getName());
        	authority.setDescription(authorityDTO.getDescription());
        	authority.setTypeUser(authorityDTO.getTypeUser());
            authority.setNextLigneRequest(authorityDTO.getNextLigneRequest());
            authority.setPartnerId(authorityDTO.getPartnerId());
            return authority;
        }
    }

    public AuthorityDTO authorityToAuthorityDTO(Authority authority) {
        return null != authority ? new AuthorityDTO(authority):null;
    }

}
