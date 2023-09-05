package carmes.fnm.sfdapp.service.mapper;

import carmes.fnm.sfdapp.domain.Ressource;

import carmes.fnm.sfdapp.service.dto.RessourceDTO;

import java.util.ArrayList;

import java.util.List;

import javax.annotation.Generated;

import org.springframework.stereotype.Component;

@Generated(

    value = "org.mapstruct.ap.MappingProcessor",

    date = "2023-09-05T16:35:06+0100",

    comments = "version: 1.1.0.Final, compiler: javac, environment: Java 1.8.0_382 (Private Build)"

)

@Component

public class RessourceMapperImpl implements RessourceMapper {

    @Override

    public RessourceDTO toDto(Ressource entity) {

        if ( entity == null ) {

            return null;
        }

        RessourceDTO ressourceDTO = new RessourceDTO();

        ressourceDTO.setId( entity.getId() );

        ressourceDTO.setName( entity.getName() );

        ressourceDTO.setCode( entity.getCode() );

        ressourceDTO.setTypeUser( entity.getTypeUser() );

        return ressourceDTO;
    }

    @Override

    public List<Ressource> toEntity(List<RessourceDTO> dtoList) {

        if ( dtoList == null ) {

            return null;
        }

        List<Ressource> list = new ArrayList<Ressource>();

        for ( RessourceDTO ressourceDTO : dtoList ) {

            list.add( toEntity( ressourceDTO ) );
        }

        return list;
    }

    @Override

    public List<RessourceDTO> toDto(List<Ressource> entityList) {

        if ( entityList == null ) {

            return null;
        }

        List<RessourceDTO> list = new ArrayList<RessourceDTO>();

        for ( Ressource ressource : entityList ) {

            list.add( toDto( ressource ) );
        }

        return list;
    }

    @Override

    public Ressource toEntity(RessourceDTO ressourceDTO) {

        if ( ressourceDTO == null ) {

            return null;
        }

        Ressource ressource_ = new Ressource();

        ressource_.setId( ressourceDTO.getId() );

        ressource_.setName( ressourceDTO.getName() );

        ressource_.setCode( ressourceDTO.getCode() );

        ressource_.setTypeUser( ressourceDTO.getTypeUser() );

        return ressource_;
    }
}

