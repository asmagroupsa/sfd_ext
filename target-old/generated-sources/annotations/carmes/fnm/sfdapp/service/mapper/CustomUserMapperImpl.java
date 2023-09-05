package carmes.fnm.sfdapp.service.mapper;

import carmes.fnm.sfdapp.domain.CustomUser;

import carmes.fnm.sfdapp.domain.User;

import carmes.fnm.sfdapp.service.dto.CustomUserDTO;

import java.util.ArrayList;

import java.util.List;

import javax.annotation.Generated;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

@Generated(

    value = "org.mapstruct.ap.MappingProcessor",

    date = "2023-09-05T16:35:06+0100",

    comments = "version: 1.1.0.Final, compiler: javac, environment: Java 1.8.0_382 (Private Build)"

)

@Component

public class CustomUserMapperImpl implements CustomUserMapper {

    @Autowired

    private UserMapper userMapper;

    @Override

    public List<CustomUser> toEntity(List<CustomUserDTO> dtoList) {

        if ( dtoList == null ) {

            return null;
        }

        List<CustomUser> list = new ArrayList<CustomUser>();

        for ( CustomUserDTO customUserDTO : dtoList ) {

            list.add( toEntity( customUserDTO ) );
        }

        return list;
    }

    @Override

    public List<CustomUserDTO> toDto(List<CustomUser> entityList) {

        if ( entityList == null ) {

            return null;
        }

        List<CustomUserDTO> list = new ArrayList<CustomUserDTO>();

        for ( CustomUser customUser : entityList ) {

            list.add( toDto( customUser ) );
        }

        return list;
    }

    @Override

    public CustomUserDTO toDto(CustomUser customUser) {

        if ( customUser == null ) {

            return null;
        }

        CustomUserDTO customUserDTO_ = new CustomUserDTO();

        customUserDTO_.setUserId( customUserUserId( customUser ) );

        customUserDTO_.setUser( customUser.getUser() );

        customUserDTO_.setId( customUser.getId() );

        customUserDTO_.setTokenExpDate( customUser.getTokenExpDate() );

        customUserDTO_.setConnecter( customUser.getConnecter() );

        customUserDTO_.setCode( customUser.getCode() );

        customUserDTO_.setAgenceReference( customUser.getAgenceReference() );

        customUserDTO_.setSfdReference( customUser.getSfdReference() );

        customUserDTO_.setZoneReference( customUser.getZoneReference() );

        return customUserDTO_;
    }

    @Override

    public CustomUser toEntity(CustomUserDTO customUserDTO) {

        if ( customUserDTO == null ) {

            return null;
        }

        CustomUser customUser_ = new CustomUser();

        customUser_.setUser( userMapper.userFromId( customUserDTO.getUserId() ) );

        customUser_.setId( customUserDTO.getId() );

        customUser_.setTokenExpDate( customUserDTO.getTokenExpDate() );

        customUser_.setConnecter( customUserDTO.getConnecter() );

        customUser_.setCode( customUserDTO.getCode() );

        customUser_.setAgenceReference( customUserDTO.getAgenceReference() );

        customUser_.setSfdReference( customUserDTO.getSfdReference() );

        customUser_.setZoneReference( customUserDTO.getZoneReference() );

        return customUser_;
    }

    private Long customUserUserId(CustomUser customUser) {

        if ( customUser == null ) {

            return null;
        }

        User user = customUser.getUser();

        if ( user == null ) {

            return null;
        }

        Long id = user.getId();

        if ( id == null ) {

            return null;
        }

        return id;
    }
}

