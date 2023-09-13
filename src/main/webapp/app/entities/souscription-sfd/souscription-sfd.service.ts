import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { JhiDateUtils } from 'ng-jhipster';

import { SouscriptionSfd } from './souscription-sfd.model';
import { ResponseWrapper, createRequestOption, UserData } from '../../shared';
import { HOST, HOST_MVN } from '../../shared/model/request-util';

@Injectable()
export class SouscriptionSfdService {
    private resourceUrl = HOST + '/api/s-fds';
    private resourceSearchUrl = HOST + '/api/s-fds';
    private resourceUrlNew = HOST + '/api/s-fds-partner';
    private subscriptionUrl = HOST_MVN + '/api/user/souscription-bailleur-sfd';
    private indicePrestataireUrl = 'http://185.98.137.71:4002/user/check-indice-prestataire';


    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    checkCARMESAccount(compteCarmes: string/* , pin: number */): Observable<any> {
        const options = createRequestOption();
        options.params.set('comptecarmes', compteCarmes);
        // options.params.set('pin', pin.toString());

        return this.http
            .get(`${HOST}/api/util/verifer-compte-carmes-complet`, options)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }

    checkIndicePrestataire(indice: string): Observable<any> {
        const options = createRequestOption();
        options.params.set('indice_prestataire', indice);

        return this.http
            .post(this.indicePrestataireUrl,{
                'indice_prestataire': indice
            }, options)
            .map((res: Response) => new ResponseWrapper(res.headers, res.json(), res.status));
    }

    // http://185.98.137.71:8989/api/user/souscription-bailleur-sfd?
    // name=alide&address=cotonou&phone=96969696&email=sfdsfd@gmail.com&
    // fax=365&bp=356&city=cotonou&created_by=admin&compte_carmes=4571254&
    // indice_prestataire=45&logo=logo&periodicity_id=10018&acteur=SFD&
    // type_abonnement=1&password=password&country_id=1


     create(souscriptionSfd: SouscriptionSfd): Observable<SouscriptionSfd> {
        const copy = this.convert(souscriptionSfd);
        console.log(copy);
        const options = createRequestOption({
            name : souscriptionSfd.name,
            address : souscriptionSfd.address,
            phone : souscriptionSfd.phone,
            email : souscriptionSfd.email,
            fax : souscriptionSfd.fax,
            bp : souscriptionSfd.bp,
            city : souscriptionSfd.city,
            created_by : souscriptionSfd.createdBy || UserData.getInstance().user_reference,
            compte_carmes : souscriptionSfd.compteCarmes,
            indice_prestataire : souscriptionSfd.indicePrestataire,
            logo: souscriptionSfd.logo,
            periodicity_id : souscriptionSfd.periodicityId,
            acteur: 'SFD',
            type_abonnement:souscriptionSfd.typeAbonnement,
            password: souscriptionSfd.password,
            country_id: souscriptionSfd.paysId
        });
        return this.http
            .get(this.subscriptionUrl, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);

                return jsonResponse;
            });
    }

   /*  create(souscriptionSfd: SouscriptionSfd): Observable<SouscriptionSfd> {

        const copy = this.convert(souscriptionSfd);
        const options = createRequestOption();
        return this.http
            .post(this.resourceUrl, copy, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);

                return jsonResponse;
            });
    } */

    update(souscriptionSfd: SouscriptionSfd): Observable<SouscriptionSfd> {
        const copy = this.convert(souscriptionSfd);
        const options = createRequestOption();
        return this.http
            .put(this.resourceUrl, copy, options)
            .map((res: Response) => {
                const jsonResponse = res.json();
                this.convertItemFromServer(jsonResponse);
                return jsonResponse;
            });
    }

    find(id: number): Observable<SouscriptionSfd> {
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

    private convert(souscriptionSfd: SouscriptionSfd): SouscriptionSfd {
        const copy: SouscriptionSfd = Object.assign({}, souscriptionSfd);
        try {
            if (copy.createdDate) {
                copy.createdDate = this.dateUtils.convertLocalDateToServer(souscriptionSfd.createdDate);
            }
            if (copy.lastModifiedDate) {
                copy.lastModifiedDate = this.dateUtils.convertLocalDateToServer(
                    souscriptionSfd.lastModifiedDate
                );
            }

        } catch (e) {
            //
        }
        return copy;
    }
}
