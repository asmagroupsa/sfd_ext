import {Component, OnInit, OnDestroy,ViewChild,ElementRef,ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ImageService, READFILEURL, UserData } from '../../../shared';
import { Subscription } from 'rxjs';
import { StateService } from '../../../shared/state/statistiques';

@Component({
    selector: 'jhi-contrat-deux-dat-request-print',
    templateUrl: './contrat-deux-dat-request-print.component.html',
    //styleUrls: ['../../shared/state/state.css']
    styleUrls: ['../../../shared/state/state.scss']

})
export class ContratDeuxDatRequestPrintComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _subscription: Subscription;
    public data: any;
    params: any;
    impression = false;

    sfdAdresse = "";
    numeroContrat= "";
    nomDeposant = "";
    prenomsDeposant = "";
    telephoneDeposant = "";
    domicileDeposant = "";
    montantDepot = "";
    dureeContrat = "";
    dateDebutContrat = "";
    dateFinContrat = "";
    tauxAnnuelNet = "";
    lieuDateSignature = "";


    @ViewChild('printZone') printZone: ElementRef;
    private imageReady:boolean;
    private increment:number=0;
    private _dataLoadEnd:boolean;
    _DePage: any;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _stateService: StateService,
        private _imageService: ImageService,
        private _changeDetectorRef:ChangeDetectorRef
    ) {
        // this.data = null;
        this._dataLoadEnd=false;

    }

    get hole(): string {
        return '___VARIABLE___';
    }

    private _loadData(): void {
        //this._dataLoadEnd = true;
        this._dataLoadEnd = false;
        this.imageReady=true;

    }

    valider(){
        this._dataLoadEnd = true;
        this.impression = true;
    }

    editContrat(){
        this._loadData();
        //this.ngOnInit();
        this.increment = 0;
        this.impression = false;
    }

    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._loadData();
        console.log('Page is ok');

    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public printAsPdf(printArea): void {
      window.frames["print_frame"].print();
  }

  get hideLoader(): boolean {
      let tmp=this._dataLoadEnd && this.imageReady;

      if(tmp){

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
