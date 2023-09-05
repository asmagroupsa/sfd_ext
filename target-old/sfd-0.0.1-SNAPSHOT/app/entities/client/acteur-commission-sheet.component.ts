
import { Component, ChangeDetectorRef,OnInit, OnDestroy,ViewChild,ElementRef,AfterViewInit,AfterContentInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import {StateService} from '../../shared/state/statistiques';
import { DatePipe } from '@angular/common';
import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from "ng-jhipster";


import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import { ClientService } from '.';
import { LanguesService } from "../../shared/myTranslation/langues";
import {UserData} from "../../shared"
import { UtilService } from "../../shared/util.service";
@Component({
  selector: 'jhi-acteur-commission-sheet',
  templateUrl: 'acteur-commission-sheet.component.html'
})
export class ActeurCommissionSheetComponent implements OnInit, OnDestroy {
  routeSub: any;
  nom:any;
  type:string;
  montant:any;
  nomSFD:string;
  agence:any;
  tmpFirst: any[];
  numTransaction:string;
  date1: any;
    date2: any;
 _DePage:any;
 cpteCarmes:any;
  phone:any;
  @ViewChild('printZone') printZone: ElementRef;
  _ficheLoadEnd :any;
_clientLoadEnd:any;
fiche:any;
  private increment:number=0;
  constructor(private route: ActivatedRoute,
    private _changeDetectorRef:ChangeDetectorRef,
    private _stateService: StateService,
    private _clientService: ClientService,
    private _spFNMService: UtilService,
    private _datePipe: DatePipe
  ) {
      this._ficheLoadEnd = false;
  }
  get hideLoader(){
      return this._ficheLoadEnd && this._clientLoadEnd;
  }
  getComissionPDF() {
      const formatDate = (date)=>{
          if(!date) return null;
          return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'dd-MM-y');
      }
      console.log(this._DePage);
        this._spFNMService.toFileRequest('report/commissions-acteur-to-file', {
            compte_carmes:this.cpteCarmes,
            date1:formatDate(this.date1),
            date2:formatDate(this.date2),
        }).then((data) => {
          this._ficheLoadEnd = true;
          this._clientLoadEnd = true;
          this.printZone.nativeElement.src = data;
        })
        .catch(() => {
          this._ficheLoadEnd = true;
          this._clientLoadEnd = true;
        });
        
        
        /* .subscribe(
            (res: any) => {
                this.fiche = res._body;
                this._ficheLoadEnd = true;
                this._clientLoadEnd = true;
                var reader = new FileReader();
                reader.addEventListener('load', () => {
                    this.printZone.nativeElement.src = reader.result;
                });
                reader.readAsDataURL(this.fiche);
            },
            (res: ResponseWrapper) => {
                //this.onError(res.json);
            }
        ); */
    }
   onPeriodChange() {
        //console.log(this.date1, this.date2);
        this.getComissionPDF();
    }

  ngOnInit() {
      this._DePage = UserData.getInstance().sfd_;
    this.routeSub = this.route.params.subscribe(params => {
        this.cpteCarmes = params['cpteCarmes'];
        this.getComissionPDF();
        /* this.phone = tmp[4]; */
        //this._ficheLoadEnd = true;
    })
  }
  ngOnDestroy() {
    UserData.getInstance().activerClientData="";
    this.routeSub.unsubscribe();
  }
}
