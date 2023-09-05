import {Component, OnInit, OnDestroy,ViewChildren,ChangeDetectorRef,Input,ViewChild,ElementRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import {EcheancesSFDService} from '../echeancier-sfd/echeances-sfd';
import { LigneCreditService} from './ligne-credit.service'
import {Subscription} from 'rxjs';
import {StateService} from '../../shared/state/statistiques';
import {UserData,EventBus} from '../../shared';
import { READFILEURL } from '../../shared/model/request-util';

@Component({
    selector: 'jhi-echeance-of-ligne-credit-sheet',
    templateUrl: './echeance-of-ligne-credit-sheet.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class EcheanceOfLigneSheetComponent implements OnInit {
    private _subscription: Subscription;
    private echeances:any;
    private params:any;
    private _ficheLoadEnd: boolean;
    private increment:number=0;
    @ViewChild('printZone') printZone: ElementRef;
    private _DePage: any;
    private imageUrl = READFILEURL;
    fiche: any[];
    _ficheLoadE: boolean;
    ficheReference: string;
    _ficheLoadRe: boolean;
    ligne_reference:any;
    ligneCredit:any;

    constructor(
        private _echeances_sfd : EcheancesSFDService,
        private _ligneCreditService: LigneCreditService,
        private activatedRoute: ActivatedRoute,
        private _stateService: StateService,
        private _changeDetectorRef:ChangeDetectorRef
    ) {
        this.echeances=[];
        this.fiche=[];
        this._ficheLoadEnd = false;
        this._ficheLoadE = false;
        this._ficheLoadRe=false;

        this.activatedRoute.params.subscribe(params => {
          this.params =parseInt(params.id);
        });
    }

    ngOnInit(){
        this._DePage = UserData.getInstance().sfd_;
        this.getEcheanceOfLigneCredit();
        this._getLigneInfos(this.params);
        this._getLigneRef(this.params);
    }
    // ngOnDestroy(){
    //   this._subscription.unsubscribe();
    // }

    // private _getLigneCredit() {
    //     this._ligneCreditService.find(this.activatedRoute.snapshot.params.id)
    //     .subscribe((l) => {
    //         this.ficheReference = l.code;
    //     });
    // }

    public getEcheanceOfLigneCredit(){
        this._ligneCreditService.echeancesLigneCredit(this.params)
      .subscribe((res) => {
          let arr = res;
          let echeancesArr = [];
          if (arr) {
              let tmp_arr = [];
              arr.forEach((element, i) => {
                  tmp_arr.push(element)
                  if ((((arr.length - 1) - i) <= 8) && ((arr.length - 1) == i)){
                      echeancesArr.push(tmp_arr);
                  }else if (tmp_arr.length == 8) {
                      echeancesArr.push(tmp_arr)
                      tmp_arr = [];
                  }
              });
              this.echeances = echeancesArr;
          }
        this._ficheLoadEnd = true;
      });
    }

    public printAsPdf(printArea): void {
        window.frames["print_frame"].print();
     }

    private _getLigneInfos(lignecreditId: number): void {
        this._ligneCreditService.ficheLigneCredit(lignecreditId)
            .subscribe(
                ((fiche: any) => {
                    console.log(fiche);
                    this.fiche = fiche.json[0];
                    this._ficheLoadE=true
                })
            );
    }

    private _getLigneRef(id){
        this._ligneCreditService.find(id)
            .subscribe(
                ((res: any) => {
                    this.ligneCredit = res;
                    this.ligne_reference = res.code;
                    this._ficheLoadRe = true
                })
            );
    }
     get hideLoader(): boolean {
       let tmp = this._ficheLoadEnd && this._ficheLoadE && this._ficheLoadRe;
       if(tmp ){
           if(this.increment===0){
               this.increment=this.increment+1
               this._changeDetectorRef.detectChanges()
               let printArea=this.printZone.nativeElement.innerHTML;
               let printCanvas=this.printZone.nativeElement.querySelectorAll('canvas');
               if(printCanvas){
                   this._stateService.printAsPdf2(printArea, printCanvas,'landscape');
               }else{
                   this._stateService.printAsPdf2(printArea, 'landscape');
               }
           }
       }
       return  tmp;
     }
}
