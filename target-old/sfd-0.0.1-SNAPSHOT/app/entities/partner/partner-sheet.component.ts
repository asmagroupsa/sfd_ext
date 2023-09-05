import {Component, OnInit, OnDestroy,ViewChildren,ChangeDetectorRef,ViewChild,ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
// import {Client, ClientService} from './';
import { PeriodicityService } from "../periodicity/periodicity.service";
import {AgenceService, Agence} from '../agence';
import { Periodicity } from "../periodicity/periodicity.model";
import {LinePipe} from './pipe';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import {LigneCreditService} from '../ligne-credit';
import {Subscription} from 'rxjs';
import {StateService} from '../../shared/state/statistiques';
import {UserData,EventBus} from '../../shared'
import { HOST, READFILEURL } from '../../shared/model/request-util';
declare const jsPDF: any;

@Component({
    selector: 'jhi-client-indentification-sheet',
    templateUrl: './partner-sheet.component.html',
    styleUrls: ['../../shared/state/state.scss']
})
export class PartnerSheetComponent implements OnInit, OnDestroy {
    private _subscription: Subscription;
    private _ficheLoadEnd: boolean;
    private _fichePeriodicityLoadEnd:boolean;
    private _clientLoadEnd: boolean;
    private _agenceLoadEnd: boolean;
    private _ligneCredits:any;
    periodicity: Periodicity[];
    private params:any;
    private increment:number=0;
    @ViewChild('printZone') printZone: ElementRef;
    private _DePage: any;
    private imageUrl = READFILEURL;

    constructor(
        private _ligneCreditService: LigneCreditService,
        private periodicityService: PeriodicityService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private _stateService: StateService,
        private _changeDetectorRef:ChangeDetectorRef
    ) {
        this._ligneCredits=[];
        this._ficheLoadEnd = false;
        this._fichePeriodicityLoadEnd=false;
        this.activatedRoute.params.subscribe(params => {
          this.params =parseInt(params.id);
        });
    }

    ngOnInit(){
        this._DePage = UserData.getInstance().sfd_;
        this.getPartnerLigneCredit();
        this.getPeriodicity();
    }
    ngOnDestroy(){
    }

    period(id: any) {
      if (!this.periodicity) return new Periodicity();
      return this.periodicity.find(periode => {
        return periode.id == id;
      });
    }

    getPeriodicity() {
      this.periodicityService.query().subscribe((res: ResponseWrapper) => {
        this.periodicity = res.json || this.principal.store["periodicity"];
        this.principal.store["periodicity"] = res.json;
        this._fichePeriodicityLoadEnd=true
      });
    }
    // _ligneCreditService.query()
    public getPartnerLigneCredit(){
      this._ligneCreditService.query()
      .subscribe((res: ResponseWrapper) => {
        this._ligneCredits = res.json;
        this._ficheLoadEnd=true;
      });
    }


    public printAsPdf(printArea): void {
         window.frames["print_frame"].print();
    }

      get hideLoader(): boolean {
        let tmp= this._ficheLoadEnd && this._fichePeriodicityLoadEnd;
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
  }
