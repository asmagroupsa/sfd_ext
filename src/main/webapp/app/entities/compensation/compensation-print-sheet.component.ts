import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserData } from '../../shared';
import { READFILEURL } from '../../shared/model/request-util';
import { StateService } from '../../shared/state/statistiques';


declare let qrGenerator: any;

@Component({
    selector: 'jhi-compensation-print-sheet',
    templateUrl: './compensation-print-sheet.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class CompensationPrintSheetComponent implements OnInit, OnDestroy {
    routeSub: any;
    infoName: any;
    typeCompensation: any;
    infoAdd: any;
    _ficheLoadEnd: any;
    private increment: number = 0;
    @ViewChild('printZone') printZone: ElementRef;
    @ViewChild('qrimage') qrimage: ElementRef;
    private _DePage: any;
    private imageUrl = READFILEURL;

    constructor(private route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _stateService: StateService,
    ) {

        this._ficheLoadEnd = false;
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this._DePage = UserData.getInstance().sfd_;
            let tmp = UserData.getInstance().compensationData[0].resultat.split("#");
            let tmpType = UserData.getInstance().compensationData[0].typeCompensation;
            this.infoName = tmp[0];
            this.infoAdd = tmp[1];
            this.typeCompensation = tmpType;
            this._ficheLoadEnd = true;
        })
    }

    get toDayDate(): Date {
        return new Date;
    }

    get hideLoader(): boolean {
        let tmp = this._ficheLoadEnd;

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

                qrGenerator().toDataURL(this.infoName, opts, (err, url) => {
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

    get todayDate(): Date {
        return new Date;
    }
    ngOnDestroy() {
        UserData.getInstance().compensationData[0] = "";
        this.routeSub.unsubscribe();
    }


    public printAsPdf(print) {
        window.frames["print_frame"].print();
    }



}
