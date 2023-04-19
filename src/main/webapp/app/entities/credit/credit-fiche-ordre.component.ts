import { Component, OnInit, OnDestroy,ViewChildren,ViewChild,ElementRef,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LanguesService } from "../../shared/myTranslation/langues";
import { StateService } from "../../shared/state/statistiques"
import { ClientService} from '../client/client.service';
import {CreditService} from './credit.service';
import {ImageService,UserData,EventBus} from '../../shared';
import { READFILEURL } from '../../shared/model/request-util';
declare let qrGenerator: any;

import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from "ng-jhipster";
declare let select_init: any;


@Component({
    selector: 'jhi-credit-fiche-ordre',
    templateUrl: './credit-fiche-ordre.component.html',
    styleUrls: ['../../shared/state/state.scss']
})
export class CreditFicheOrdreComponent implements OnInit, OnDestroy {
    private _DePage: any;
    imageUrl = READFILEURL;
    routeSub: any;
    private _currentCreditComityDossiers: any[];
    private _currentCreditFicheOrdre:any[];
    ficheClient:any
    _ficheLoadEnd:boolean;
    @ViewChild('printZone') printZone: ElementRef;
    @ViewChild('qrimage') qrimage: ElementRef;
    private imageReady:boolean;
    private increment:number=0;
    private _dataLoadEnd:boolean;
    private qrObj: any = { type: 'SFD', reference: '' }

    constructor(
        private route: ActivatedRoute,
        public langue: LanguesService,
        private creditService: CreditService,
        public _stateService:StateService,
        private _clientService: ClientService,
        private _imageService: ImageService,
        private _changeDetectorRef:ChangeDetectorRef
    ) {
      this.ficheClient=[];
      this._ficheLoadEnd = false;
      this._dataLoadEnd=false
    }

    ngAfterViewInit() {
      select_init();
    }
  //
    get currentCreditComityDossiers(): any[] {
      return this._currentCreditComityDossiers;
    }

    ngOnInit(): void {
      this._DePage = UserData.getInstance().sfd_;
      this.routeSub = this.route.params.subscribe((params: any[]) => {
        const creditComityId: number = parseInt(params['id']);
        this._getApprobationSheet(creditComityId)
        this.showFicheOrdre(creditComityId);
      });
      this.qrObj.reference = UserData.getInstance().currentSfdReference;
     
   }

    ngOnDestroy() {
      this.routeSub.unsubscribe();
    }

    public showFicheOrdre(creditComityDossierId: number): void {
         this.creditService.showFicheOrdre(creditComityDossierId)
        .subscribe((data) => {

            this._currentCreditFicheOrdre = data;
            for(  let tmpData=0 ;  
                    tmpData<=this._currentCreditFicheOrdre.length-1;tmpData++){

              if (this._currentCreditFicheOrdre[tmpData].photo){
                this._imageService.getImageData(this._currentCreditFicheOrdre[tmpData].photo)
                .then((dataUrl) => {
                    this._currentCreditFicheOrdre[tmpData].photo = dataUrl;
                    if(tmpData == this._currentCreditFicheOrdre.length-1){
                      this.imageReady=true;
                    }
                })
                .catch((error)=>{
                  this._currentCreditFicheOrdre[tmpData].photo = '../../../content/images/avatar.png'
                  this.imageReady=true;
                })
              }else {
                  this._currentCreditFicheOrdre[tmpData].photo = '../../../content/images/avatar.png'
                  if(tmpData == this._currentCreditFicheOrdre.length-1){
                    this.imageReady=true;
                  }
              }
            }

          this._dataLoadEnd=true;
         });
    }



    private _getApprobationSheet(creditId: number): void {
        this.creditService.approbationSheet(creditId)
        .subscribe(
            ((fiche: any) => {
                this.ficheClient = fiche.json[0];
                this._ficheLoadEnd = true;
            })
        );
    }
    get hideLoader(): boolean {
        // return this._ficheLoadEnd;
        let tmp=this._dataLoadEnd && this._ficheLoadEnd&& this.imageReady;

            if(tmp ){

              if(this.increment===0){
                  this.increment=this.increment+1
                  this._changeDetectorRef.detectChanges()

                  let opts = {
                    errorCorrectionLevel: 'H',
                    type: 'image/webp',
                    rendererOpts: {
                      quality: 0.3
                    }
                  }

                qrGenerator().toDataURL(JSON.stringify(this.qrObj), opts, (err, url) => {
                    if (err) throw err
                    this.qrimage.nativeElement.src = url;
                    /* img.src = url */
                  })

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

    public printAsPdf(print){
        window.frames["print_frame"].print();
    }
}
