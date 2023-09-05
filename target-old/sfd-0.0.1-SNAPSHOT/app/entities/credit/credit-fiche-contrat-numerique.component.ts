import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreditService } from './credit.service';
import { StateService } from '../../shared/state/statistiques';
import { Subscription } from 'rxjs';
import { UserData, EventBus } from '../../shared'
import { READFILEURL } from '../../shared/model/request-util';
declare let qrGenerator: any;
declare let toWords: any;

@Component({
    selector: 'jhi-credit-contrat-numerique',
    templateUrl: './credit-fiche-contrat-numerique.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class CreditContratNumeriqueComponent implements OnInit, OnDestroy {
    private _creditId: number;
    private _subscription: Subscription;
    public data: any;
    private sfdName: any;
    private amountTotal: any;
    @ViewChild('printZone') printZone: ElementRef;
    @ViewChild('qrimage') qrimage: ElementRef;
    private imageReady: boolean;
    private increment: number = 0;
    private _dataLoadEnd: boolean;
    private _DePage: any;
    private imageUrl = READFILEURL;
    private qrObj: any = { type: 'SFD', reference: '' };
    private amountTotal_en_lettre:string;
    private nominal_en_lettre: string;
    private interet_en_lettre: string;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _creditService: CreditService,
        private _stateService: StateService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this.data = null;
        this._dataLoadEnd = false
    }

    get endLoad(): boolean {
        // return this.data != null;
        let tmp = this._dataLoadEnd;

        if (tmp) {

            if (this.increment === 0) {
                this.increment = this.increment + 1
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

                let printArea = this.printZone.nativeElement.innerHTML;
                let printCanvas = this.printZone.nativeElement.querySelectorAll('canvas');

                if (printCanvas) {
                    this._stateService.printAsPdf2(printArea, printCanvas);
                } else {
                    this._stateService.printAsPdf2(printArea);
                }
            }
        }
        return tmp;
    }

    private _loadData(): void {
        this._creditService.loanAgreement(this._creditId)
            .then((data: any) => {
                this.sfdName = UserData.getInstance().sfdName;
                this.amountTotal = data.interet + data.nominal;
                this.nominal_en_lettre = toWords(data.nominal)
                this.interet_en_lettre = toWords(data.interet); 
                this.amountTotal_en_lettre = toWords(data.amountTotal);
                this.data = data;
                // this.imageReady=true;
                this._dataLoadEnd = true;
            });
    }

    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    public ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;

        this._subscription = this._activatedRoute.params.subscribe((params: any[]) => {
            this._creditId = parseInt(params['id']);
            this._loadData();
        });
        this.qrObj.reference = UserData.getInstance().currentSfdReference;
    }
    get todayDate(): Date {
        return new Date;
    }
    public printAsPdf(print): void {
        window.frames["print_frame"].print();
    }
}
