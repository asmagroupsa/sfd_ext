package carmes.fnm.sfdapp.service.mapper;

import carmes.fnm.sfdapp.domain.AuthorityResource;

import carmes.fnm.sfdapp.domain.Ressource;

import carmes.fnm.sfdapp.service.dto.AuthorityResourceDTO;

import java.util.ArrayList;

import java.util.List;

import javax.annotation.Generated;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

@Generated(

    value = "org.mapstruct.ap.MappingProcessor",

    date = "2023-09-05T19:55:06+0100",

    comments = "version: 1.1.0.Final, compiler: javac, environment: Java 1.8.0_382 (Private Build)"

)

@Component

public class AuthorityResourceMapperImpl implements AuthorityResourceMapper {

    @Autowired

    private RessourceMapper ressourceMapper;

    @Override

    public List<AuthorityResource> toEntity(List<AuthorityResourceDTO> dtoList) {

        if ( dtoList == null ) {

            return null;
        }

        List<AuthorityResource> list = new ArrayList<AuthorityResource>();

        for ( AuthorityResourceDTO authorityResourceDTO : dtoList ) {

            list.add( toEntity( authorityResourceDTO ) );
        }

        return list;
    }

    @Override

    public List<AuthorityResourceDTO> toDto(List<AuthorityResource> entityList) {

        if ( entityList == null ) {

            return null;
        }

        List<AuthorityResourceDTO> list = new ArrayList<AuthorityResourceDTO>();

        for ( AuthorityResource authorityResource : entityList ) {

            list.add( toDto( authorityResource ) );
        }

        return list;
    }

    @Override

    public AuthorityResourceDTO toDto(AuthorityResource authorityResource) {

        if ( authorityResource == null ) {

            return null;
        }

        AuthorityResourceDTO authorityResourceDTO_ = new AuthorityResourceDTO();

        authorityResourceDTO_.setRessourceId( authorityResourceRessourceId( authorityResource ) );

        authorityResourceDTO_.setId( authorityResource.getId() );

        authorityResourceDTO_.setAuthority( authorityResource.getAuthority() );

        return authorityResourceDTO_;
    }

    @Override

    public AuthorityResource toEntity(AuthorityResourceDTO authorityResourceDTO) {

        if ( authorityResourceDTO == null ) {

            return null;
        }

        AuthorityResource authorityResource_ = new AuthorityResource();

        authorityResource_.setRessource( ressourceMapper.fromId( authorityResourceDTO.getRessourceId() ) );

        authorityResource_.setId( authorityResourceDTO.getId() );

        authorityResource_.setAuthority( authorityResourceDTO.getAuthority() );

        return authorityResource_;
    }

    private Long authorityResourceRessourceId(AuthorityResource authorityResource) {

        if ( authorityResource == null ) {

            return null;
        }

        Ressource ressource = authorityResource.getRessource();

        if ( ressource == null ) {

            return null;
        }

        Long id = ressource.getId();

        if ( id == null ) {

            return null;
        }

        return id;
    }
}

