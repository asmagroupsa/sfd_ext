import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { SouscriptionBailleur } from './souscription-bailleur.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST, HOST_MVN } from '../../shared/model/request-util';

@Injectable()
export class SouscriptionBailleurService {
    private resourceUrl = HOST + '/api/s-fds';
    private resourceSearchUrl = HOST + '/api/s-fds';
    private resourceUrlNew = HOST + '/api/s-fds-partner';
    private subscriptionUrl = HOST_MVN + '/api/user/souscription-bailleur-sfd';


    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    checkCARMESAccount(compteCarmes: string/* , pin: number */): Observable<any> {
        const options = createRequestOption();
        options.params.set('comptecarmes', compteCarmes);
        // options.params.set('pin', pin.toString());

        return this.http
            .get(`${HOST}/api/util/verifer-compte-carmes-complet`, options)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }


    // http://185.98.137.71:8989/api/user/souscription-bailleur-sfd?
    // name=alide&address=cotonou&phone=96969696&email=sfdsfd@gmail.com&
    // fax=365&bp=356&city=cotonou&created_by=admin&compte_carmes=4571254&
    // indice_prestataire=45&logo=logo&periodicity_id=10018&acteur=SFD&
    // type_abonnement=1&password=password&country_id=1


     create(souscriptionBailleur: SouscriptionBailleur): Observable<SouscriptionBailleur> {
        const copy = this.convert(souscriptionBailleur);
        console.log(copy);
        const options = createRequestOption({
            name : souscriptionBailleur.name,
            address : souscriptionBailleur.address,
            phone : souscriptionBailleur.phone,
            email : souscriptionBailleur.email,
            fax : souscriptionBailleur.fax,
            bp : souscriptionBailleur.bp,
            city : souscriptionBailleur.city,
            created_by : souscriptionBailleur.createdBy || UserData.getInstance().user_reference,
            compte_carmes : souscriptionBailleur.compteCarmes,
            indice_prestataire : souscriptionBailleur.indicePrestataire,
            logo: souscriptionBailleur.logo,
            periodicity_id : souscriptionBailleur.periodicityId,
            acteur: 'SFD',
            type_abonnement:souscriptionBailleur.typeAbonnement,
            password: 'password',
            country_id: souscriptionBailleur.paysId
        });
        return this.http
            .get(this.subscriptionUrl, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);

                return jsonResponse;
            });
    } 

   /*  create(souscriptionBailleur: SouscriptionBailleur): Observable<SouscriptionBailleur> {

        const copy = this.convert(souscriptionBailleur);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);

                return jsonResponse;
            });
    } */

    update(souscriptionBailleur: SouscriptionBailleur): Observable<SouscriptionBailleur> {
        const copy = this.convert(souscriptionBailleur);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<SouscriptionBailleur> {
        const options = createRequestOption();
        return this.http
            .get(`${this.resourceUrl}/${id}`, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        //options.params.set('partner', UserData.getInstance().partnerId ?   UserData.getInstance().partnerId.toString() : '30060' );
        options.params.set('partner', UserData.getInstance().sfdId ?   UserData.getInstance().sfdId.toString() : '0' );
        //options.params.set('partner', UserData.getInstance().partnerId.toString());
        console.log(UserData.getInstance().sfdId);

        return this.http
            .get(this.resourceUrlNew, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        const options = createRequestOption();
        return this.http.delete(`${this.resourceUrl}/${id}`, options);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options)
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
        if (entity.createdDate) {
            entity.createdDate = this.dateUtils.convertLocalDateFromServer(
                entity.createdDate
            );
        }
        if (entity.lastModifiedDate) {
            entity.lastModifiedDate = this.dateUtils.convertLocalDateFromServer(
                entity.lastModifiedDate
            );
        }
    }

    private convert(souscriptionBailleur: SouscriptionBailleur): SouscriptionBailleur {
        const copy: SouscriptionBailleur = Object.assign({}, souscriptionBailleur);
        try {
            if (copy.createdDate) {
                copy.createdDate = this.dateUtils.convertLocalDateToServer(souscriptionBailleur.createdDate);
            }
            if (copy.lastModifiedDate) {
                copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
                    souscriptionBailleur.lastModifiedDate
                );
            }

        } catch (e) {
            //
        }
        return copy;
    }
}
