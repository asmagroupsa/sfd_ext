

import { EventBus } from '../model/functions';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import { HOST } from '../model/request-util';
import { User } from './user.model';
import { ResponseWrapper } from '../model/response-wrapper.model';
import { createRequestOption, HOST_MVN } from '../model/request-util';
import { UserData } from '..';
import { JhiDateUtils } from 'ng-jhipster';
import { Injectable } from '@angular/core';
@Injectable()
export class UserService {
    changePasswordUrl: string = `${HOST_MVN}/api/user/initialiser-password`;
    users: any = [];
    private resourceUrl = `${HOST_MVN}/api/users`;
    private insertUserUrl = `${HOST_MVN}/api/user/insert-user`;
    private ownUrl = HOST_MVN + '/api/user/custom/by-user-reference';
    private deconnecterUrl: string = `${HOST_MVN}/api/user/deconnecter-by-login`;
    private usersUrl = `${HOST_MVN}/api/user/liste-utilisateurs`;
    constructor(private http: Http, private dateUtils: JhiDateUtils) { }
    deconnecterUser(login: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.params.set('login', login);
        return this.http
            .get(this.deconnecterUrl, options)
            .catch((res: Response) => {
                if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);
                return Observable.throw(res);
            })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    changePhoto(url: string): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.params.set('photo', url);
        return this.http
            .get(`${HOST_MVN}/api/account/change_photo`, options)
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    changePassword(login: any, pass: string): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.params.set('login', login);
        options.params.set('password_hash', pass);
        return this.http
            .get(this.changePasswordUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }
    queryUsers(
        country:any,
        etat: any = 'TOUS',
        typeUser?,
        login?: string,
        
    ): Observable<ResponseWrapper | any> {
        let user;
        if (this.users) {
            user = this.users.find(user => {
                return user.login == login;
            });
        }
        if (login && user) {
            return Observable.create(observer => {
                observer.next(user);
            });
        }
        const options = createRequestOption();
        options.params.set(
            'user_reference',
            UserData.getInstance().userReference
        );
        options.params.set('typeUser', typeUser);
        options.params.set('type_user', typeUser); 
        options.params.set('etat', etat);
        options.params.set('country_id', country);
        return this.http.get(this.usersUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            this.users = res.json();
            if (login) {
                user = this.users.find(user => {
                    return user.login == login;
                });
                return user;
            }
            return new ResponseWrapper(res.headers, res.json(), res.status);
        });
    }
    queryOwnUsers(): Observable<ResponseWrapper> {
        this.ownUrl =
            HOST_MVN +
            '/api/user/custom/by-user-reference?user_reference=' +
            UserData.getInstance().userReference;
        const options = createRequestOption();
        return this.http
            .get(this.ownUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }
    activerDesactiverUser(login: string, activated: any) {
        const options = createRequestOption();
        options.params.set('login', login);
        options.params.set('activated', activated);
        return this.http
            .get(`${HOST_MVN}/api/users/activate-user-login`, options)
            .map((res: Response) => this.convertResponse(res));
    }
    addGuichetierSFD(o): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.params.set('name', o.last_name);
        options.params.set('first_name', o.first_name);
        options.params.set('username', o.login);
        options.params.set('tel', o.phone);
        options.params.set('password_hash', o.password_hash);
        options.params.set('email', o.email);
        options.params.set('agence_reference', o.agence_reference);
        options.params.set('created_by', o.created_by);
        options.params.set('profil_user', o.profil_user + '*ROLE_USER');

        return this.http
            .get(`${HOST_MVN}/api/user/add-guichetier-sfd`, options)
            .map((res: Response) => this.convertResponse(res));
    }

    listeUtilisateursProfil(authority: string) {
        const options = createRequestOption();
        options.params.set('authority', authority);

        if (UserData.getInstance().currentAgence) {
            options.params.set('agence_reference', UserData.getInstance().currentAgence.codeAgence);
            options.params.set('partner_id', UserData.getInstance().partner_id.toString());
        }

        return this.http
            .get(`${HOST_MVN}/api/user/liste-utilisateurs-profil`, options)
            .map((res: Response) => res.json());
    }

    create(model: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.params = options.params || new URLSearchParams();
        let parameters = this.convert(model);
        const allowedParams = [
            'id',
            'login',
            'password_hash',
            'first_name',
            'last_name',
            'email',
            'phone',
            'image_url',
            'activated',
            'created_by',
            'chaine_authorities',
            'sfd_reference',
            'zone_reference',
            'agence_reference',
            'zone_sfd_ref',
            'date_function',
            'date_end_function',
            'signature_url',
            'carte_url',
            'country_id'
        ];

        for (let allowedParam of allowedParams) {
            options.params.set(allowedParam, parameters[allowedParam]);
        }

        options.params.set('typeUser', 'SFD');

        return this.http
        .get(this.insertUserUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
        .map((res: Response) => this.convertResponse(res));
    }

    update(user: User): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.headers.append('Content-Type', 'application/json');
        return this.http
            .put(this.resourceUrl, user, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    find(login: string): Observable<User> {
        const options = createRequestOption();
        options.headers.append('Content-Type', 'application/json');
        return this.http
            .get(`${this.resourceUrl}/${login}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => res.json());
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => this.convertResponse(res));
    }

    public guichetierPrint(guichetierId: number): Promise<any> {
        return this.http
            .get(
                `${HOST}/api/report/client/fiche-adhesion/?client_id=${guichetierId}`,
                createRequestOption()
            )
            .toPromise()
            .then((res: Response) => res.json()[0]);
    }

    delete(login: string): Observable<Response> {
        const options = createRequestOption();
        options.headers.append('Content-Type', 'application/json');
        return this.http.delete(`${this.resourceUrl}/${login}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    authorities(): Observable<string[]> {
        const options = createRequestOption();
        options.headers.append('Content-Type', 'application/json');
        options.params.set("typeUser.equals", 'SFD');
        return this.http
            .get(`${HOST_MVN}/api/users/authorities`, options)
            .map((res: Response) => {
                const json = res.json();
                return <string[]>json;
            });
    }

    authoritys(queries?: any) {
        const options = createRequestOption(Object.assign({}, queries, { NO_QUERY: true }));
        options.params.set("typeUser.in", 'SFD,SOUS_TRAITANT');
        // options.params.set("typeUser.equals", 'SFD');
        return this.http
            .get(`${HOST_MVN}/api/authoritys`, options)
            .map((res: Response) => res.json());
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }
    private convert(modelUser: any): any {
        const copy: any = Object.assign({}, modelUser);
        if (copy.date_function) {
            /* copy.date_function = this.dateUtils.convertLocalDateToServer(
                modelUser.date_function
            ); */
            copy.date_function = `${copy.date_function.day}-${copy.date_function.month}-${copy.date_function.year}`;
        }
        if (copy.date_end_function) {
            /* copy.date_end_function = this.dateUtils.convertLocalDateToServer(
                modelUser.date_end_function
            ); */
            copy.date_end_function = `${copy.date_end_function.day}-${copy.date_end_function.month}-${copy.date_end_function.year}`;
        }
        return copy;
    }
}
