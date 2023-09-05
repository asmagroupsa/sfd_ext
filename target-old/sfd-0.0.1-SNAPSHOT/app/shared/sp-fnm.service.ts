import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {HOST, createRequestOption} from './model/request-util';
import {Observable} from 'rxjs';
import {resultatOKFn, EventBus} from './model/functions';
import {UserData, ResponseWrapper} from "./index";

@Injectable()
export class SPFNMService {
    private _url = HOST + '/api/fnm/';

    constructor(private _http: Http) {}

    associerLigneCreditComite(queryParams) {
        return this._http.get(
            this._url + 'associer-ligne-credit-comite',
            createRequestOption({
                NO_QUERY: true,
                ...queryParams,
            })
        ).map(resultatOKFn).toPromise();
    }

    listeLigneNonEpuise() {
        return this._http.get(
            this._url + 'liste-ligne-non-epuise',
            createRequestOption({
                sfd_reference: UserData.getInstance().getSFD().code,
                NO_QUERY: true,
            })
        ).map((r) => r.json()).toPromise();
    }

    verifierInfosSousTraitant(queryParams) {
        return this._http.get(
            this._url + 'verifier-infos-sous-traitant',
            createRequestOption({
                NO_QUERY: true,
                ...queryParams,
            })
        ).map((r) => r.json()).toPromise();
    }

    listeCompensationByCompensateur(queryParams) {
        return this._http.get(
            this._url + 'liste-compensation-by-compensateur',
            createRequestOption({
                NO_QUERY: true,
                ...queryParams,
            })
        ).map((r) => r.json()).toPromise();
    }

    verifierSoldeLigneAvantDemande() {
        return this._http.get(
            this._url + 'verifier-solde-ligne-avant-demande',
            createRequestOption({
                sfd_reference: UserData.getInstance().getSFD().code,
                NO_QUERY: true,
            })
        ).map(resultatOKFn).toPromise();
    }

    insertionRequestCompensation(queryParams) {
        return this._http.get(
            this._url + 'insertion-request-compensation',
            createRequestOption({
                NO_QUERY: true,
                ...queryParams,
            })
        ).map(resultatOKFn).toPromise();
    }

    verifierSoldeCompensationMarchand(queryParams) {
        return this._http.get(
            this._url + 'verifier-solde-compensation-marchand',
            createRequestOption({
                NO_QUERY: true,
                ...queryParams,
            })
        )
        .map((r) => {
            const j = r.json();

            if (j.resultat === 'OK') {
                if (j.solde === 0) {
                    throw 'AUCUNE_' + queryParams.type_compensation;
                }

                return j.solde;
            }

            throw j.resultat;
        })
        .toPromise();
    }

    listeAgents(args) {
        return this._http.get(this._url + 'liste-agents', createRequestOption({
            ...args,
            NO_QUERY: true,
        }))
        .map((r) => r.json()).toPromise();
    }
    _listeAgents(args): Observable<ResponseWrapper> {
         return this._http.get(this._url + 'liste-agents', createRequestOption({
            ...args,
            NO_QUERY: true,
        })).catch(
            (res: Response) => {         
                if (res.status == 401) 
                EventBus.publish('NOT_AUTHORIZED', true);
          return Observable.throw(res);       })
        .map((res: Response) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    /* query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
          .get(this.resourceUrl, options).catch(
              (res: Response) => {         
                  if (res.status == 401) 
                  EventBus.publish('NOT_AUTHORIZED', true);
            return Observable.throw(res);       })
          .map((res: Response) => this.convertResponse(res));
      } */
}
