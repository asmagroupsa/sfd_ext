package carmes.fnm.sfdapp.service.mapper;

import carmes.fnm.sfdapp.domain.*;
import carmes.fnm.sfdapp.service.dto.CustomUserDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity CustomUser and its DTO CustomUserDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class, })
public interface CustomUserMapper extends EntityMapper <CustomUserDTO, CustomUser> {

    @Mapping(source = "user.id", target = "userId")
    CustomUserDTO toDto(CustomUser customUser); 

    @Mapping(source = "userId", target = "user")
    CustomUser toEntity(CustomUserDTO customUserDTO); 
    default CustomUser fromId(Long id) {
        if (id == null) {
            return null;
        }
        CustomUser customUser = new CustomUser();
        customUser.setId(id);
        return customUser;
    }
}
