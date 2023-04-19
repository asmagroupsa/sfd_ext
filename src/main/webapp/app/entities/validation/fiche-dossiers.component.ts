import { Component, OnInit, OnDestroy, ViewChildren, ChangeDetectorRef, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ValidationService } from './validation.service';
import { LanguesService } from "../../shared/myTranslation/langues";
import { StateService } from "../../shared/state/statistiques"
import { ImageService, UserData, EventBus } from '../../shared'

import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from "ng-jhipster";
declare let select_init: any;


@Component({
    selector: 'jhi-fiche-dossiers',
    templateUrl: './fiche-dossiers.component.html',
    styleUrls: ['../../shared/state/state.scss']
})
export class FicheDossiersComponent implements OnInit, OnDestroy {
    routeSub: any;
    private _currentCreditComityDossiers: any[];
    private _currentCreditComityFicheDossiers: any[];
    private increment: number = 0;
    private imageReady: boolean;
    private _ficheLoadEnd: boolean;
    @ViewChild('printZone') printZone: ElementRef;

    constructor(
        private route: ActivatedRoute,
        public langue: LanguesService,
        private validationService: ValidationService,
        public _stateService: StateService,
        // private _imageService: ImageService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this._ficheLoadEnd = false;
    }

    ngAfterViewInit() {
        select_init();
    }

    get hideLoader(): boolean {
        // return this._currentCreditComityDossiers;
        let tmp = this._ficheLoadEnd;
        if (tmp) {
            if (this.increment === 0) {
                this.increment = this.increment + 1
                this._changeDetectorRef.detectChanges()

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


    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe((params: any[]) => {
            const dossierId: number = parseInt(params['id']);
            this.showFicheDossiers(dossierId);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    public showFicheDossiers(creditComityDossierId: number): void {
        this.validationService.showFicheDossier(creditComityDossierId)
            .subscribe((data) => {

                if (data[0].reference != null)
                    this._currentCreditComityFicheDossiers = data;
                this._ficheLoadEnd = true;
            });
    }

    public printAsPdf(print) {
        window.frames["print_frame"].print();
    }
}
