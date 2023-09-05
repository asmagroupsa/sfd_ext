import { Component, OnInit, OnDestroy,ViewChildren,ChangeDetectorRef,Input,ViewChild,ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ValidationService } from './validation.service';
import { LanguesService } from "../../shared/myTranslation/langues";
import { StateService } from "../../shared/state/statistiques"
import {ImageService,UserData,EventBus} from '../../shared'
import { HOST, READFILEURL } from '../../shared/model/request-util';

import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from "ng-jhipster";
declare let select_init: any;


@Component({
    selector: 'jhi-fiche-dossiers-comity-member',
    templateUrl: './fiche-dossiers-comity-member.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class FicheDossiersComityMemberComponent implements OnInit, OnDestroy {
    routeSub: any;
    private _currentCreditComityDossiers: any[];
    private _currentCreditComityFicheDossiersComityMember:any[];
    private increment:number=0;
    private imageReady:boolean;
    private _ficheLoadEnd: boolean;
    @ViewChild('printZone') printZone: ElementRef;
    private _DePage: any;
    private imageUrl = READFILEURL;
    
    constructor(
        private route: ActivatedRoute,
        public langue: LanguesService,
        private validationService: ValidationService,
        public _stateService:StateService,
        private _changeDetectorRef:ChangeDetectorRef
    ) {
        this._ficheLoadEnd = false;
     }

    ngAfterViewInit() {
      select_init();
    }
  //
    get hideLoader(): boolean {
      let tmp= this._ficheLoadEnd  ;

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

    ngOnInit(): void {
      this._DePage = UserData.getInstance().sfd_;
      this.routeSub = this.route.params.subscribe((params: any[]) => {
        const dossierId: number = parseInt(params['id']);
        this.showFicheDossiersComityMember(dossierId);
      });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    public showFicheDossiersComityMember(creditComityDossierId: number): void {
         this.validationService.showFicheDossierComityMember(creditComityDossierId)
        .subscribe((data) => {
            this._currentCreditComityFicheDossiersComityMember = data;
            this._ficheLoadEnd=true;
         });
    }

    public printAsPdf(print){
      window.frames["print_frame"].print();

    }
}
