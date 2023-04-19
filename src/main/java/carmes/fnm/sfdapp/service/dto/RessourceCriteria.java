package carmes.fnm.sfdapp.service.dto;

import java.io.Serializable;
import io.github.jhipster.service.filter.*;
public class RessourceCriteria implements Serializable {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter name;

    private StringFilter code;

    private AuthorityCriteria.TypeUserFilter typeUser;

    public RessourceCriteria(){

    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getName() {
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public StringFilter getCode() {
        return code;
    }

    public void setCode(StringFilter code) {
        this.code = code;
    }

    public AuthorityCriteria.TypeUserFilter getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(AuthorityCriteria.TypeUserFilter typeUser) {
        this.typeUser = typeUser;
    }

    @Override
    public String toString() {
        return "RessourceCriteria{" +
            (id != null ? "id=" + id + ", " : "") +
            (name != null ? "name=" + name + ", " : "") +
            (code != null ? "code=" + code + ", " : "") +
            (typeUser != null ? "typeUser=" + typeUser + ", " : "") +
            "}";
    }
}
