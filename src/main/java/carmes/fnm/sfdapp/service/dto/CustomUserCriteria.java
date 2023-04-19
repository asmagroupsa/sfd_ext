package carmes.fnm.sfdapp.service.dto;

import java.io.Serializable;

import carmes.fnm.sfdapp.util.BooleanFilter;
import io.github.jhipster.service.filter.*;


public class CustomUserCriteria implements Serializable {

    private static final long serialVersionUID = 1L;

    private StringFilter code;

    private StringFilter agenceReference;

    private StringFilter sfdReference;

    private StringFilter zoneReference;

    private BooleanFilter connecter;

    private InstantFilter tokenExpDate;

    private LongFilter userId;

    public CustomUserCriteria() {

    }

    public StringFilter getCode() {
        return code;
    }

    public void setCode(StringFilter code) {
        this.code = code;
    }

    public StringFilter getAgenceReference() {
        return agenceReference;
    }

    public void setAgenceReference(StringFilter agenceReference) {
        this.agenceReference = agenceReference;
    }

    public StringFilter getSfdReference() {
        return sfdReference;
    }

    public void setSfdReference(StringFilter sfdReference) {
        this.sfdReference = sfdReference;
    }

    public StringFilter getZoneReference() {
        return zoneReference;
    }

    public void setZoneReference(StringFilter zoneReference) {
        this.zoneReference = zoneReference;
    }

    public BooleanFilter getConnecter() {
        return connecter;
    }

    public void setConnecter(BooleanFilter connecter) {
        this.connecter = connecter;
    }

    public InstantFilter getTokenExpDate() {
        return tokenExpDate;
    }

    public void setTokenExpDate(InstantFilter tokenExpDate) {
        this.tokenExpDate = tokenExpDate;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "CustomUserCriteria{" +
            (code != null ? "code=" + code + ", " : "") +
            (agenceReference != null ? "agenceReference=" + agenceReference + ", " : "") +
            (zoneReference != null ? "zoneReference=" + zoneReference + ", " : "") +
            (sfdReference != null ? "sfdReference=" + sfdReference + ", " : "") +
            (connecter != null ? "connecter=" + connecter + ", " : "") +
            (tokenExpDate != null ? "tokenExpDate=" + tokenExpDate + ", " : "") +
            (userId != null ? "userId=" + userId + ", " : "") +
            "}";
    }
}
