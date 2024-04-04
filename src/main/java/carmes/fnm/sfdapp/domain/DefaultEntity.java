package carmes.fnm.sfdapp.domain;

import java.io.Serializable;
import java.time.Instant;
import java.util.Date;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.SqlResultSetMappings;

import carmes.fnm.sfdapp.util.ListeUtilisateurAgenceInfo;
import carmes.fnm.sfdapp.util.ListeUtilisateurParProfilInfo;
import carmes.fnm.sfdapp.util.QrCodeUserFNMInfo;
import carmes.fnm.sfdapp.util.QrCodeUserSFDInfo;
import carmes.fnm.sfdapp.util.RessourceCodeInfo;
import carmes.fnm.sfdapp.util.RessourceInfo;
import carmes.fnm.sfdapp.util.ResultInfo;
import carmes.fnm.sfdapp.util.UserInfo;
import carmes.fnm.sfdapp.util.UserResourceAgenceInfo;
import carmes.fnm.sfdapp.util.UserSFDInfo;


@Entity
@SqlResultSetMappings({

@SqlResultSetMapping(name="ResultInfo",
classes = {
    @ConstructorResult(

            targetClass = ResultInfo.class,
            columns = {
                @ColumnResult(name = "resultat",  type = String.class)
            })
}),
@SqlResultSetMapping(name="RessourceCodeInfo",
classes = {
    @ConstructorResult(

            targetClass = RessourceCodeInfo.class,
            columns = {
                @ColumnResult(name = "code",  type = String.class)
            })
}),

@SqlResultSetMapping(name="RessourceInfo",
classes = {
    @ConstructorResult(

            targetClass = RessourceInfo.class,
            columns = {
                @ColumnResult(name = "id",  type = Long.class) ,
                @ColumnResult(name = "code",  type = String.class),
                @ColumnResult(name = "name",  type = String.class)
            })
}),
@SqlResultSetMapping(name="UserResourceAgenceInfo",
classes = {
    @ConstructorResult(


            targetClass = UserResourceAgenceInfo.class,
            columns = {
                @ColumnResult(name = "ressource",  type = String.class) ,
                @ColumnResult(name = "sfd_reference",  type = String.class) ,
                @ColumnResult(name = "agence_reference",  type = String.class)  ,
                @ColumnResult(name = "zone_reference",  type = String.class)  ,
                @ColumnResult(name = "user_reference",  type = String.class) ,
                @ColumnResult(name = "liste_agence", type = String.class),
                @ColumnResult(name = "code_partenaire", type = String.class),
                @ColumnResult(name = "partner_id", type = Long.class),
                @ColumnResult(name = "country_id", type = Long.class)
            })
}),

@SqlResultSetMapping(name="ListeUtilisateurParProfilInfo",
classes = {
    @ConstructorResult(


            targetClass = ListeUtilisateurParProfilInfo.class,
            columns = {
                @ColumnResult(name = "id",  type = Long.class) ,
                @ColumnResult(name = "name",  type = String.class) ,
                @ColumnResult(name = "user_reference", type = String.class),
                @ColumnResult(name = "login",  type = String.class) ,
                @ColumnResult(name = "email",  type = String.class) ,
                @ColumnResult(name = "client_id",  type = String.class)
            })
}),
@SqlResultSetMapping(name="UserInfo",
classes = {
    @ConstructorResult(
            targetClass = UserInfo.class,
            columns = {
                @ColumnResult(name = "id",  type = Long.class) ,
                @ColumnResult(name = "login",  type = String.class) ,
                @ColumnResult(name = "last_name",  type = String.class)  ,
                @ColumnResult(name = "first_name",  type = String.class)  ,
                @ColumnResult(name = "email",  type = String.class) ,
                @ColumnResult(name = "activated", type = Boolean.class),
                @ColumnResult(name = "connecter", type = Boolean.class) ,

                @ColumnResult(name = "created_by",  type = String.class) ,
                @ColumnResult(name = "agence_reference",  type = String.class)  ,
                @ColumnResult(name = "sfd_reference",  type = String.class)  ,
                @ColumnResult(name = "zone_reference",  type = String.class) ,
                @ColumnResult(name = "image_url",  type = String.class)  ,
                @ColumnResult(name = "phone",  type = String.class)  ,
                @ColumnResult(name = "authority",  type = String.class),
                @ColumnResult(name = "carte_url",  type = String.class),
                @ColumnResult(name = "signature_url",  type = String.class),
                @ColumnResult(name = "cle_connexion",  type = String.class)
            })
})
,
@SqlResultSetMapping(name="UserSFDInfo",
classes = {
    @ConstructorResult(
            targetClass = UserSFDInfo.class,
            columns = {
                @ColumnResult(name = "id",  type = Long.class) ,
                @ColumnResult(name = "login",  type = String.class) ,
                @ColumnResult(name = "last_name",  type = String.class)  ,
                @ColumnResult(name = "first_name",  type = String.class)  ,
                @ColumnResult(name = "email",  type = String.class) ,
                @ColumnResult(name = "activated", type = Boolean.class),
                @ColumnResult(name = "connecter", type = Boolean.class)
            })
})
,
@SqlResultSetMapping(name="QrCodeUserFNMInfo",
classes = {
    @ConstructorResult(
            targetClass = QrCodeUserFNMInfo.class,
            columns = {
                @ColumnResult(name = "id",  type = Long.class) ,
                @ColumnResult(name = "login",  type = String.class) ,
                @ColumnResult(name = "last_name",  type = String.class)  ,
                @ColumnResult(name = "first_name",  type = String.class)  ,
                @ColumnResult(name = "authority_name",  type = String.class) ,

                @ColumnResult(name = "image_url",  type = String.class)  ,
                @ColumnResult(name = "signature_url",  type = String.class)  ,
                @ColumnResult(name = "date_function",  type = Instant.class) ,

                @ColumnResult(name = "date_end_function",  type = Instant.class)  ,
                @ColumnResult(name = "phone",  type = String.class)  ,
                @ColumnResult(name = "email",  type = String.class) ,
                @ColumnResult(name = "carte_url",  type = String.class)

            })
}),

@SqlResultSetMapping(name="ListeUtilisateurAgenceInfo",
classes = {
    @ConstructorResult(
            targetClass = ListeUtilisateurAgenceInfo.class,
            columns = {
                @ColumnResult(name = "id",  type = Long.class) ,
                @ColumnResult(name = "reference",  type = String.class) ,
                @ColumnResult(name = "login",  type = String.class) ,
                @ColumnResult(name = "name",  type = String.class)  ,
                @ColumnResult(name = "first_name",  type = String.class),
                @ColumnResult(name = "authorities", type = String.class)
            })
}),

@SqlResultSetMapping(name="QrCodeUserSFDInfo",
classes = {
    @ConstructorResult(
            targetClass = QrCodeUserSFDInfo.class,
            columns = {
                @ColumnResult(name = "id",  type = Long.class) ,
                @ColumnResult(name = "login",  type = String.class) ,
                @ColumnResult(name = "last_name",  type = String.class)  ,
                @ColumnResult(name = "first_name",  type = String.class)  ,
                @ColumnResult(name = "authority_name",  type = String.class) ,

                @ColumnResult(name = "image_url",  type = String.class)  ,
                @ColumnResult(name = "signature_url",  type = String.class)  ,
                @ColumnResult(name = "date_function",  type = Instant.class) ,

                @ColumnResult(name = "date_end_function",  type = Instant.class)  ,
                @ColumnResult(name = "phone",  type = String.class)  ,
                @ColumnResult(name = "user_email",  type = String.class) ,

                @ColumnResult(name = "sfd_name",  type = String.class)  ,
                @ColumnResult(name = "sfd_phone",  type = String.class)  ,
                @ColumnResult(name = "indice",  type = String.class) ,
                @ColumnResult(name = "sfd_email",  type = String.class),
                @ColumnResult(name = "carte_url",  type = String.class)

            })
})
})
public class DefaultEntity implements Serializable {

	private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
}
