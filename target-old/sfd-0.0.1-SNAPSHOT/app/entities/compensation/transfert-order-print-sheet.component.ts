import { Component, ChangeDetectorRef, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, AfterContentInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { StateService } from '../../shared/state/statistiques';

import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from "ng-jhipster";


import { CompensationService } from "./compensation.service";
declare let qrGenerator: any;
declare let toWords: any;

@Component({
    selector: 'jhi-ordre-virement-print-sheet',
    templateUrl: './transfert-order-print-sheet.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class OrdreVirementPrintSheetComponent implements OnInit, OnDestroy {
    routeSub: any;
    data: any
    _ficheLoadEnd: any;
    private increment: number = 0;
    @ViewChild('printZone') printZone: ElementRef;
    @ViewChild('qrimage') qrimage: ElementRef;
    private qrObj: any = { type: 'order', reference: '' };
    private montant_en_lettre: string;
    private benef: any;
    private emit: any;
    _ficheLoad: boolean;
    benefLoadEnd: boolean;
    emitLoadEnd: boolean;
    static TransferOrderPrintComponent: any;
    sign1 = `data:image/jpeg;base64,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`;
    sign2 = `data:image/jpeg;base64,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`;


    constructor(private route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private ordreVirement: CompensationService,
        private _stateService: StateService,
    ) {
        this.data = [];
        this.emit = [];
        this.benef = [];
        this.benefLoadEnd = false;
        this.emitLoadEnd = false;
        this._ficheLoadEnd = false;
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            const req: any = { 'id.equals': params['id'] };
            this.ordreVirement.getOrdreVirements(req).subscribe(
                (res) => {
                    this.data = res.json[0]
                    this.qrObj.reference = this.data.reference;
                    this.montant_en_lettre = toWords(this.data.montantVirement)
                    console.log(this.data)
                    console.log(this.data.numeroComptBeneficiaire)
                    this.getAccountInfo(this.data.numeroComptBeneficiaire)
                        .subscribe(
                            (res) => {
                                console.log(res);
                                console.log(res.json[0]);
                                this.benef = res.json[0];
                                this.benefLoadEnd = true;
                            }
                        );

                    console.log(this.data.numeroCompteDonneurOrdre)
                    this.getAccountInfo(this.data.numeroCompteDonneurOrdre)
                        .subscribe(
                            (res) => {
                                console.log(res);
                                console.log(res.json[0]);
                                this.emit = res.json[0];
                                this.emitLoadEnd = true;
                                /*  this._ficheLoadEnd = true; */
                            }
                        );

                },
            );
        })
    }

    getAccountInfo(req) {
        return this.ordreVirement.getAccountOrders(req)
    }

    get toDayDate(): Date {
        return new Date;
    }

    get hideLoader(): boolean {
        let tmp = this.emitLoadEnd && this.benefLoadEnd;

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

    get todayDate(): Date {
        return new Date;
    }
    ngOnDestroy() {
        /*  UserData.getInstance().compensationData[0] = ""; */
        this.routeSub.unsubscribe();
    }


    public printAsPdf(print) {
        window.frames["print_frame"].print();
    }



}
