
import {EventBus} from '../../shared/model/functions';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import {BankAccountClient} from './bank-account-client.model';
import {ResponseWrapper, createRequestOption, HOST, UserData} from '../../shared';
import {Injectable} from '@angular/core';
@Injectable()
export class BankAccountClientService {
    private resourceUrl = HOST + '/api/bank-account-clients';
    private resourceSearchUrl = HOST + '/api/_search/banks';

    constructor(private http: Http) {}

    create(bank: BankAccountClient): Observable<BankAccountClient> {
        const copy = this.convert(bank);
        return this.http
            .post(this.resourceUrl, copy, createRequestOption())
            .map((res: Response) => {
                return res.json();
            });
    }

    update(bank: BankAccountClient): Observable<BankAccountClient> {
        const copy = this.convert(bank);
        return this.http
            .put(this.resourceUrl, copy, createRequestOption())
            .map((res: Response) => {
                return res.json();
            });
    }

    find(id: number): Observable<BankAccountClient> {
        return this.http
            .get(`${this.resourceUrl}/${id}`, createRequestOption())
            .map((res: Response) => {
                return res.json();
            });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(
            Object.assign({}, req, {
                NO_QUERY: true
            })
        );
        return this.http
        .get(this.resourceUrl, options).catch((res: Response) => {if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res);})
        .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`, createRequestOption());
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http
            .get(this.resourceSearchUrl, options).catch((res: Response) => {if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return Observable.throw(res);})
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convert(bank: BankAccountClient): BankAccountClient {
        const copy: BankAccountClient = Object.assign({}, bank);
        return copy;
    }
}
