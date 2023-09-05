import { Http } from "@angular/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Subject } from "rxjs/Subject";
import { Principal } from "../auth/principal.service";
@Injectable()
export class LanguesService {
  french: any;
  english: any;
  lang: string = "fr";
  langState: Subject<any> = new Subject<any>();

  constructor(private http: Http, public principal: Principal) {
    this.getFrench();
    this.getEnglish();
  }
  changeLang(lang: string) {
    if (lang == "en" || lang == "fr") {
      this.lang = lang;
      this.principal.loading =
        lang == "fr" ? "Chargement des données" : "Loading data";
      this.langState.next(lang);
    }
  }
  getLang() {
    return this.lang;
  }
  getTranslations(): Observable<any> {
    if (this.lang == "en") {
      return this.getEnglish();
    } else {
      return this.getFrench();
    }
  }
  getFrench(): Observable<any> {
    return Observable.create(observer => {
      if (this.french) {
        observer.next(this.french);
      } else {
        this.http.get(`i18n/fr.json`).subscribe(res => {
          this.french = res.json();
          observer.next(this.french);
        });
      }
    });
  }
  getEnglish(): Observable<any> {
    return Observable.create(observer => {
      if (this.english) {
        observer.next(this.english);
      } else {
        this.http.get(`i18n/en.json`).subscribe(res => {
          this.english = res.json();
          observer.next(this.english);
        });
      }
    });
  }
}
