
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

import { Operation } from "./operation.model";
import { OperationService } from "./operation.service";
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from "../../shared";
import { PaginationConfig } from "../../blocks/config/uib-pagination.config";
import { LanguesService } from "../../shared/myTranslation/langues";
import { UserData } from "../../shared"
declare let qrGenerator: any;

@Component({
    selector: 'jhi-compensation-print-sheet',
    templateUrl: 'retrait-local-print-sheet.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class RetraitLocalPrintSheetComponent implements OnInit, OnDestroy {
    routeSub: any;
    nom: any;
    type: string;
    montant: any;
    nomSFD: string;
    agence: any;
    numpiece: string;
    phone: any;
    _ficheLoadEnd: any;
    private increment: number = 0;
    @ViewChild('printZone') printZone: ElementRef;
    @ViewChild('qrimage') qrimage: ElementRef;
    private qrObj: any = { type: 'SFD', reference: '' };

    constructor(private route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _stateService: StateService,
    ) {
        this._ficheLoadEnd = false;
    }

    ngOnInit() {

        this.routeSub = this.route.params.subscribe(params => {

            this.type = UserData.getInstance().compensationData[0].type;

            let tmp = UserData.getInstance().compensationData[0].client.split("*");
            this.nom = tmp[2];
            this.montant = UserData.getInstance().compensationData[0].amount;
            this.agence = UserData.getInstance().currentAgence;
            this.nomSFD = tmp[1];;
            this.numpiece = tmp[3];
            this.phone = tmp[4];
            this._ficheLoadEnd = true;
        })
        this.qrObj.reference = UserData.getInstance().currentSfdReference;
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
        UserData.getInstance().compensationData[0] = "";
        this.routeSub.unsubscribe();
    }


    public printAsPdf(print) {
        window.frames["print_frame"].print();
    }



}
