import {Component, OnInit, OnDestroy,ViewChild,ElementRef,ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CreditRequestService} from '.';
import {Subscription} from 'rxjs';
import {StateService} from '../../shared/state/statistiques';
import {UserData,EventBus} from '../../shared';
import {ImageService} from '../../shared/image.service';
import { READFILEURL } from '../../shared/model/request-util';

@Component({
    selector: 'jhi-credit-request-print',
    templateUrl: './credit-request-print.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class CreditRequestPrintComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _subscription: Subscription;
    private _creditRequestId: number;
    public data: any;

    @ViewChild('printZone') printZone: ElementRef;
    private imageReady:boolean;
    private increment:number=0;
    private _dataLoadEnd:boolean;
    _DePage: any;

    constructor(
        private _creditRequestService: CreditRequestService,
        private _activatedRoute: ActivatedRoute,
        private _stateService: StateService,
        private _imageService: ImageService,
        private _changeDetectorRef:ChangeDetectorRef
    ) {
        // this.data = null;
        this._dataLoadEnd=false
    }

    get hole(): string {
        return '___VARIABLE___';
    }

    private _loadData(): void {
        this._creditRequestService.query(this._creditRequestId)
        .subscribe((data: any) => {
            this.data = data.json[0];
            this.imageReady=true;
            this._dataLoadEnd = true;
        });
    }

    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            this._creditRequestId = parseInt(params['id']);
            this._loadData();
        });
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
