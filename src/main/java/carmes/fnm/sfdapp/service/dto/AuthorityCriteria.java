package carmes.fnm.sfdapp.service.dto;

import java.io.Serializable;

import carmes.fnm.sfdapp.domain.enumeration.TypeUser;
import io.github.jhipster.service.filter.*;

public class AuthorityCriteria implements Serializable {

    public static class TypeUserFilter extends Filter<TypeUser> {
    }

    private static final long serialVersionUID = 1L;
    private StringFilter name;

     private StringFilter description;

     private TypeUserFilter typeUser;

    private StringFilter nextLigneRequest;

    private LongFilter partnerId;

    public AuthorityCriteria() {

    }

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public StringFilter getDescription() {
        return description;
    }

    public void setDescription(StringFilter description) {
        this.description = description;
    }

    public TypeUserFilter getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(TypeUserFilter typeUser) {
        this.typeUser = typeUser;
    }

    public StringFilter getNextLigneRequest() {
        return nextLigneRequest;
    }

    public void setNextLigneRequest(StringFilter nextLigneRequest) {
        this.nextLigneRequest = nextLigneRequest;
    }

    public LongFilter getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(LongFilter partnerId) {
        this.partnerId = partnerId;
    }


    @Override
    public String toString() {
        return "AuthorityCriteria{" +
            (name != null ? "name=" + name + ", " : "") +
            (description != null ? "description=" + description + ", " : "") +
            (typeUser != null ? "typeUser=" + typeUser + ", " : "") +
            (nextLigneRequest != null ? "nextLigneRequest=" + nextLigneRequest + ", " : "") +
            "}";
    }

}
