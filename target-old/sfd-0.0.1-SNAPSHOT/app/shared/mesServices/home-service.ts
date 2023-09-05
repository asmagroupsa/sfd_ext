import { Injectable } from "@angular/core";
import { Http, Response, BaseRequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import { HOST, createRequestOption } from "../model/request-util";
import { ResponseWrapper } from "../model/response-wrapper.model";
import { Principal } from "../auth/principal.service";
import { EventBus } from "..";
declare let jQuery: any;
@Injectable()
export class HomeService {
  nFois: number = 3;
  private professionsUrl = HOST + "/api/clients";
  private clientsUrl = HOST + "/api/clients";
  private agencesUrl = HOST + "/api/agences";
  private demandesUrl = HOST + "/api/credit-requests";
  private creditsUrl = HOST + "/api/credits";
  private produitsUrl = HOST + "/api/produits";
  private periodicitiesUrl = HOST + "/api/periodicities";
  constructor(private http: Http, private principal: Principal) { }
  getInitial() {
    this.getProduits();
    this.getClients();
    this.getAgences();
    this.getDemandes();
    this.getcredits();
    this.getPeriodicity();
  }
  getLocation(): Promise<any> {
    if (this.principal.store["coords"])
      return Promise.resolve(this.principal.store["coords"]);
    return new Promise((resolve,reject)=>{
navigator.geolocation.getCurrentPosition((data)=>{
 if (data && data.coords){
   let obj = Object.assign({},data.coords,{lat:data.coords.latitude,lon:data.coords.longitude});
   this.principal.store["coords"] = obj;
   resolve(this.principal.store["coords"]);
 }else reject(null); 
},(err)=>{
  if(err.code == 1 || err.message == 'User denied Geolocation'){
    alert('Veuillez activer votre géolocalisation');
  }
 this.http.get("http://ip-api.com/json",createRequestOption())
                    .map((data:Response)=>{
                      if (data.json()) this.principal.store["coords"] = data.json();
                      return data.json();
                    }).subscribe((data)=>{
resolve(data);
                    },(err)=>{
                      reject(null);
                    });
})
    });
  }
  getClients() {
    const options = createRequestOption({ size: 1000 });
    this.http
      .get(this.clientsUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      )
      .subscribe((res: ResponseWrapper) => {
        if (res.status == 200) this.principal.store["clients"] = res.json;

      });
  }
  getProfessions() {
    const options = createRequestOption({ size: 1000 });
    this.http
      .get(this.professionsUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      )
      .subscribe((res: ResponseWrapper) => {
        if (res.status == 200) this.principal.store["professions"] = res.json;
        //return res;
      });
  }
  getAgences() {
    const options = createRequestOption({ size: 1000 });
    this.http
      .get(this.agencesUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      )
      .subscribe((res: ResponseWrapper) => {
        if (res.status == 200) this.principal.store["agences"] = res.json;
        //return res;
      });
  }
  getDemandes() {
    const options = createRequestOption({ size: 1000 });
    this.http
      .get(this.demandesUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      )
      .subscribe((res: ResponseWrapper) => {
        if (res.status == 200) this.principal.store["demandes"] = res.json;
        //return res;
      });
  }
  getcredits() {
    const options = createRequestOption({ size: 1000 });
    this.http
      .get(this.creditsUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      )
      .map((res: ResponseWrapper) => {
        if (res.status == 200) this.principal.store["credits"] = res.json;
        //return res;
      });
  }
  getProduits() {
    const options = createRequestOption({ size: 1000 });
    this.http
      .get(this.produitsUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map((res: Response) => {

        return new ResponseWrapper(res.headers, res.json(), res.status);
      })
      .subscribe((res: ResponseWrapper) => {

        if (res.status == 200) this.principal.store["produits"] = res.json;

      });
  }
  getPeriodicity() {
    const options = createRequestOption({ size: 1000 });
    this.http
      .get(this.periodicitiesUrl, options).catch((res: Response) => {         if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true);         return Observable.throw(res);       })
      .map(
        (res: Response) =>
          new ResponseWrapper(res.headers, res.json(), res.status)
      )
      .subscribe((res: ResponseWrapper) => {
        if (res.status == 200) this.principal.store["periodicity"] = res.json;
        //return res;
      });
  }
}
