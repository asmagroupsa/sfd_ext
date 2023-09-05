
import { Component, ChangeDetectorRef,OnInit, OnDestroy,ViewChild,ElementRef,AfterViewInit,AfterContentInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import {StateService} from '../../shared/state/statistiques';

import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from "ng-jhipster";


import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";

import { LanguesService } from "../../shared/myTranslation/langues";
import {UserData} from "../../shared"
@Component({
  selector: 'jhi-activer-print-sheet',
  templateUrl: 'activer-print-sheet.component.html',
  styleUrls: ['../../shared/state/state.css']
})
export class ActiverPrintSheetComponent implements OnInit, OnDestroy {
  routeSub: any;
  nom:any;
  type:string;
  montant:any;
  nomSFD:string;
  agence:any;
  tmpFirst: any[];
  numTransaction:string;
 /*  numpiece:string; */
  phone:any;
  _ficheLoadEnd :any;
  private increment:number=0;
  @ViewChild('printZone') printZone: ElementRef;
  constructor(private route: ActivatedRoute,
    private _changeDetectorRef:ChangeDetectorRef,
    private _stateService: StateService,
  ) {
      this._ficheLoadEnd = false;
  }

  ngOnInit() {
      
    this.routeSub = this.route.params.subscribe(params => {
        UserData.getInstance().activerClientData
        /* this.type = UserData.getInstance().activerClientData; */

        let tmp:any[]  = UserData.getInstance().activerClientData.other.split("*");
        this.tmpFirst= tmp[0].split(",");
        
        
        this.nomSFD = tmp[1];
        this.nom = tmp[2];
        this.montant = UserData.getInstance().activerClientData.amount;
        this.agence=UserData.getInstance().currentAgence;
        
        this.numTransaction = tmp[3];
        /* this.phone = tmp[4]; */
        this._ficheLoadEnd = true;
    })
  }

  get toDayDate(): Date {
      return new Date;
  }

  get hideLoader(): boolean {
      let tmp=this._ficheLoadEnd;

      if(tmp ){
          if(this.increment===0){
              this.increment=this.increment+1
              this._changeDetectorRef.detectChanges()

              let printArea=this.printZone.nativeElement.innerHTML;

              let printCanvas=this.printZone.nativeElement.querySelectorAll('canvas');

              if(printCanvas){
                  this._stateService.printAsPdf2(printArea,printCanvas);
              }else{
                  this._stateService.printAsPdf2(printArea);
              }
          }
      }
      return  tmp;
  }

  get todayDate(): Date {
      return new Date;
  }
  ngOnDestroy() {
    UserData.getInstance().activerClientData="";
    this.routeSub.unsubscribe();
  }


  public printAsPdf(print){
      window.frames["print_frame"].print();
  }



}
