import { Injectable } from '@angular/core';
import { BaseRequestOptions, Http, Response, ResponseContentType, URLSearchParams } from '@angular/http';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { createRequestOption, ResponseWrapper, UserData,READFILEURL, CARMES_HOST } from '../../shared';
import { EventBus, getUserRefOrChaineAgence } from '../../shared/model/functions';
import { HOST, LOCAL_FLAG, HOST_MVN } from '../../shared/model/request-util';
import { Client } from './client.model';
import {TypeClientService} from "../type-client/type-client.service";

@Injectable()
export class ClientService {
    private resourceUrl = HOST + '/api/clients';
    private clientsByTypeUrl = HOST + '/api/client/by-type';
    private resourceSearchUrl = HOST + '/api/_search/clients';
    private activerClientUrl = HOST + '/api/client/activation-client';
    private disabledMemberUrl = HOST +
        '/api/client/activer-desactiver-membre-group';
    private clientIndividuDisponibleUrl: string = HOST +
        '/api/client/liste-client-cible';
    private getAgentAyantEnroleUrl: string = HOST +
        '/api/client/agent-ayant-enrole';
    constructor(
        private http: Http,
        private dateUtils: JhiDateUtils,
        // private _typeClientService: TypeClientService,
    ) { }
    queryCarmesInfos(cpteCarmes: string): Observable<any> {
        let body = new URLSearchParams();
        body.set('action', "getUserID");
        body.set('usrAccount', cpteCarmes);
        const options: BaseRequestOptions = new BaseRequestOptions();
        options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
        options.headers.append('accept', 'application/json');

        return this.http
            .post(CARMES_HOST + '/carte_puce/appGetUserCompletId.php', body.toString(), options)
            .map((response: any) => {
                try {
                    return response.json();
                } catch (e) {
                    let parse = JSON.stringify(`${response._body}`.trim());
                    return JSON.parse(parse);
                }
            });
    }
    getClientListePdf(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        
        let param = getUserRefOrChaineAgence();
        options.params.set(param[0], param[1]);
        
        options.responseType = ResponseContentType.Blob;
        return this.http
            .get(`${HOST}/api/stat/liste-all-clients-to-pdf`, options)
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res, res.status);
            });
    }
    clientIndividuDisponible(id: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('produit_id', id);
        let param = getUserRefOrChaineAgence();
        options.params.set(param[0], param[1]);
        
        return this.http
            .get(this.clientIndividuDisponibleUrl, options)
            .catch((res: Response) => {
                if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);
                return Observable.throw(res);
            })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    disabledMember(id: any, etat: any = false): Observable<ResponseWrapper> {
        const options = createRequestOption();
        
        options.params.set('client_id', id);
        options.params.set('etat', etat);
        
        return this.http
            .get(this.disabledMemberUrl, options).catch((res: Response) => {
                if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);
                return Observable.throw(res);
            })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    getAgentAyantEnrole(idClient: any): Observable<ResponseWrapper> {
        const options = createRequestOption();
        options.params.set('client_id', idClient);
        if (UserData.getInstance().sfd_) {
            options.params.set('indice', UserData.getInstance().sfd_.indicePrestataire);
        }
        return this.http
            .get(this.getAgentAyantEnroleUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    activerClient(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.activerClientUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    queryClientsByType(code: string, req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        
        options.params.set('type_client_code', code);
        
        return this.http
            .get(this.clientsByTypeUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                return new ResponseWrapper(res.headers, res.json(), res.status);
            });
    }
    create(client: Client): Observable<Client> {
        const copy = this.convert(client);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    update(client: Client): Observable<Client> {
        const copy = this.convert(client);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<Client> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    verifierCompteCarmes(compteCarmes: string/* , pin: number */): Observable<any> {
        const options = createRequestOption();
        options.params.set('comptecarmes', compteCarmes);
        // options.params.set('pin', pin.toString());

        return this.http
            .get(`${HOST}/api/util/verifer-compte-carmes-complet`, options)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }

    verifierInfoClient(params: any): Observable<any> {
        let d = this.dateUtils
            .convertLocalDateToServer(params.dateNaiss)
            .split('-');
        let ds = `${d[2]}-${d[1]}-${d[0]}`;
        const options = createRequestOption();
        options.params.set('nom', params.nom);
        options.params.set('prenom', params.prenom);
        options.params.set('date_naiss', ds);
        options.params.set('phone', params.phone);
        return this.http
            .get(`${HOST}/api/util/verifer-info-client`, options)
            .map(
                (res: Response) =>
                    new ResponseWrapper(res.headers, res.json(), res.status)
            );
    }

    query(req?: any): Observable<ResponseWrapper> {
        let params: any = req;
        if (LOCAL_FLAG) {
            params = Object.assign({}, req);
            if (!params.hasOwnProperty('status.equals')) {
                params['status.equals'] = true;
            }
            if (!params.hasOwnProperty('depart.equals')) {
                params['depart.equals'] = false;
            }

        }
        const options = createRequestOption(params);
        return this.http.get(this.resourceUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); }).map((res: Response) => {
            return this.convertResponse(res);
        });
    }

    listeClientCredit(typeClient: string, creditEnCours: boolean) {
        const options = createRequestOption();
        options.params.set('typeclient', typeClient);
        options.params.set('encours', `${creditEnCours}`);
        let params = getUserRefOrChaineAgence();
        options.params.set(params[0], params[1]);

        return this.http.get(`${HOST}/api/client/liste-client-credit`, options).map((res: Response) => {
            return this.convertResponse(res);
        });
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); });
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res); })
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.dateHour = new Date(entity.createdDate + (entity.heure ? (' ' + entity.heure) : ''));
        entity.birthDate = this.dateUtils.convertLocalDateFromServer(
            entity.birthDate
        );
        entity.createdDate = this.dateUtils.convertLocalDateFromServer(
            entity.createdDate
        );
        entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
            entity.lastModifiedDate
        );
    }

    private convert(client: Client): Client {
        const copy: Client = Object.assign({}, client);
        copy.birthDate = this.dateUtils.convertLocalDateToServer(
            client.birthDate
        );
        copy.createdDate = this.dateUtils.convertLocalDateToServer(
            client.createdDate
        );
        copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
            client.lastModifiedDate
        );
        return copy;
    }
    commissionActeurSheetPdf(req?:any): Observable<any> {
        const options = createRequestOption(req);
        options.params.set('file_type', '');
        options.params.set('qrcode', JSON.stringify({ type: 'SFD', reference: UserData.getInstance().getSFD().code}));
        options.responseType = ResponseContentType.Blob;
        return this.http
            .get(
                `${HOST}/api/report/commissions-acteur-to-file`, options)
            .map((res: Response) => res);
    }
    conditionAccesSheetPdf(clientId: number, sfd_name: string, agence_name: string, agence_phone: string, client_code: string, client_name: string, client_firstname: string, client_phone: string, client_photo: string, produit?: any): Observable<any> {
        const options = createRequestOption();
        options.params.set('client_id', `${clientId}`);
        options.params.set('produit_id', produit);
        options.params.set('sfd_name', sfd_name);
        options.params.set('agence_name', agence_name);
        options.params.set('agence_phone', agence_phone);
        options.params.set('client_code', client_code);
        options.params.set('client_name', client_name);
        options.params.set('client_firstname', client_firstname);
        options.params.set('client_phone', client_phone);
        options.params.set('client_photo', READFILEURL + client_photo);
        options.params.set('qrcode', JSON.stringify({ type: 'SFD', reference: UserData.getInstance().getSFD().code}));
        options.responseType = ResponseContentType.Blob;
        return this.http
            .get(
                `${HOST}/api/report/client/condition-acces-to-file`, options)
            .map((res: Response) => res);
    }
    conditionAccesSheet(clientId: number, produit?: any): Observable<any> {
        const options = createRequestOption();
        options.params.set('client_id', `${clientId}`);
        options.params.set('produit_id', produit);
        return this.http
            .get(
                `${HOST}/api/report/client/condition-acces`, options)
            .map((res: Response) => res.json());
    }
    public indetificationSheet(clientId: number): Observable<any> {
        return this.http
            .get(
                `${HOST}/api/report/client/fiche-identification/?client_id=${clientId}`,
                createRequestOption()
            )
            .map((res: Response) => res.json()[0]);
    }

    public membershipForm(clientId: number): Promise<any> {
        return this.http
            .get(
                `${HOST}/api/report/client/fiche-adhesion/?client_id=${clientId}`,
                createRequestOption()
            )
            .toPromise()
            .then((res: Response) => res.json()[0]);
    }

    createClientGroup(params) {
        const options = createRequestOption();

        // tslint:disable-next-line:forin
        for (const param in params) {
            options.params.set(param, params[param]);
        }

        return this.http
            .get(`${HOST}/api/client/insertion-client-group`, options)
            .map((res: Response) => {
                return res.json();
            });
    }

    infoMarchand(clientId) {
        const options = createRequestOption();
        options.params.set('client_id', clientId);

        return this.http
            .get(HOST + '/api/sfd/info-marchand', options)
            .map((res) => res.json());
    }

    initialiserPassword(login: string, password: string): Observable<void> {
        const options = createRequestOption();
        options.params.set('login', login);
        options.params.set('password_hash', password);

        return this.http.get(HOST_MVN + '/api/user/initialiser-password', options)
        .map((r) => {
            const resultat = r.json().resultat;

            if (resultat !== 'OK') {
                throw new Error(resultat);
            }

            return;
        });
    }

    disconnect(cpteCarmes: string) {
        return this.http
            .get(
                `${HOST_MVN}/api/user/deconnecter-by-login?login=${cpteCarmes}`,
                createRequestOption()
            )
            .map((res: Response) => res.json());
    }

    getByCARMESAccount(carmesAccount) {
        return this.http.get(this.resourceUrl, createRequestOption({'cpteCarmes.equals': carmesAccount,NO_QUERY: true}))
        .map((r) => {
            const c = r.json()[0];
            if (c) {
                return c;
            }
            throw c;
        })
        .toPromise();
    }


}
