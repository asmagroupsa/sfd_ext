package carmes.fnm.sfdapp.service.dto;

import java.io.Serializable;
import io.github.jhipster.service.filter.*;

public class UserCriteria implements Serializable {
    private static final long serialVersionUID = 1L;

    private StringFilter login;

    private StringFilter firstName;

    private StringFilter lastName;

    private StringFilter email;

    private StringFilter imageUrl;

    private StringFilter langKey;

    private StringFilter createdBy;

    private InstantFilter createdDate;

    private StringFilter lastModifiedBy;

    private InstantFilter lastModifiedDate;

    private AuthorityCriteria.TypeUserFilter typeUser;

//    private StringFilter authoritiesId;

    public UserCriteria(){

    }

    public StringFilter getLogin() {
        return login;
    }

    public void setLogin(StringFilter login) {
        this.login = login;
    }

    public StringFilter getFirstName() {
        return firstName;
    }

    public void setFirstName(StringFilter firstName) {
        this.firstName = firstName;
    }

    public StringFilter getLastName() {
        return lastName;
    }

    public void setLastName(StringFilter lastName) {
        this.lastName = lastName;
    }

    public StringFilter getEmail() {
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
    }

    public StringFilter getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(StringFilter imageUrl) {
        this.imageUrl = imageUrl;
    }

    public StringFilter getLangKey() {
        return langKey;
    }

    public void setLangKey(StringFilter langKey) {
        this.langKey = langKey;
    }

    public StringFilter getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(StringFilter createdBy) {
        this.createdBy = createdBy;
    }

    public InstantFilter getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(InstantFilter createdDate) {
        this.createdDate = createdDate;
    }

    public StringFilter getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(StringFilter lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public InstantFilter getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(InstantFilter lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public AuthorityCriteria.TypeUserFilter getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(AuthorityCriteria.TypeUserFilter typeUser) {
        this.typeUser = typeUser;
    }

    //    public StringFilter getAuthoritiesId() {
//        return authoritiesId;
//    }
//
//    public void setAuthoritiesId(StringFilter authoritiesId) {
//        this.authoritiesId = authoritiesId;
//    }

    @Override
    public String toString() {
        return "UserCriteria{" +
            (login != null ? "login=" + login + ", " : "") +
            (firstName != null ? "firstName=" + firstName + ", " : "") +
            (lastName != null ? "lastName=" + lastName + ", " : "") +
            (email != null ? "email=" + email + ", " : "") +
            (imageUrl != null ? "imageUrl=" + imageUrl + ", " : "") +
            (langKey != null ? "langKey=" + langKey + ", " : "") +
            (createdBy != null ? "createdBy=" + createdBy + ", " : "") +
            (createdDate != null ? "createdDate=" + createdDate + ", " : "") +
            (lastModifiedBy != null ? "lastModifiedBy=" + lastModifiedBy + ", " : "") +
            (lastModifiedDate != null ? "lastModifiedDate=" + lastModifiedDate + ", " : "") +
            (typeUser != null ? "typeUser=" + typeUser + ", " : "") +
            "}";
    }
}
