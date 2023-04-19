import {Component, OnDestroy, OnInit,ViewChild,ElementRef,ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EtudeService} from '.';
import {CreditRequestService} from '../credit-request';
import {StateService} from '../../shared/state/statistiques';
import {Subscription} from 'rxjs';
import {ImageService,UserData,EventBus} from '../../shared'
import { READFILEURL } from '../../shared/model/request-util';

@Component({
    selector: 'jhi-etude-print-ab',
    templateUrl: './etude-print.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class EtudePrintComponent implements OnInit, OnDestroy {
    public _subscription: Subscription;
    public _creditRequestId: number;
    public data: any;
    @ViewChild('printZone') printZone: ElementRef;
    private imageReady:boolean;
    private increment:number=0;
    private _dataLoadEnd:boolean;
    private _DePage: any;
    private imageUrl = READFILEURL;

    constructor(
        private _etudeService: EtudeService,
        private _creditRequestService: CreditRequestService,
        private _stateService: StateService,
        private _activatedRoute: ActivatedRoute,
        private _imageService: ImageService,
        private _changeDetectorRef:ChangeDetectorRef
    ) {
        this.data = null;
        this._dataLoadEnd=false
    }

    get endLoad(): boolean {
        // return this.data != null;
        let tmp=this._dataLoadEnd && this.imageReady;
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

      private _loadData(): void {
          this._etudeService.procesEtude(this._creditRequestId)
          .then((data: any) => {
              this.data = data;
              this.imageReady=true;
              this._dataLoadEnd = true;
          });
    }

    public ngOnDestroy(): void {
      this._subscription.unsubscribe();
    }

    public ngOnInit(): void {
      this._DePage = UserData.getInstance().sfd_;
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            this._creditRequestId = parseInt(params['creditRequestId']);
            this._loadData();
        });
    }

    public printAsPdf(print): void {
        window.frames["print_frame"].print();
    }
}
