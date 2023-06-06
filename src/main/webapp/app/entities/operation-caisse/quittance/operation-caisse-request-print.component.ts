import {Component, OnInit, OnDestroy,ViewChild,ElementRef,ChangeDetectorRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { ImageService, READFILEURL, UserData } from '../../../shared';
import { Subscription } from 'rxjs';
import { CreditRequestService } from '../../credit-request';
import { StateService } from '../../../shared/state/statistiques';

@Component({
    selector: 'jhi-credit-request-print',
    templateUrl: './operation-caisse-request-print.component.html',
    //styleUrls: ['../../shared/state/state.css']
    styleUrls: ['../../../shared/state/state.scss']
})
export class OperationCaisseRequestPrintComponent implements OnInit, OnDestroy {
    private imageUrl = READFILEURL;
    private _subscription: Subscription;
    private _creditRequestId: number;
    public data: any;
    params: any;
    nomOperation  = "Operation";

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
        this._dataLoadEnd=false;

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
            this._activatedRoute.queryParams.subscribe(params => {
                console.log(params);
                this.params = params;
                this.nomOperation = this.params.nomOperation;
                console.log(this.nomOperation);

            });
        });
    }

    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            this._creditRequestId = parseInt(params['id']);
            console.log(params);

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
