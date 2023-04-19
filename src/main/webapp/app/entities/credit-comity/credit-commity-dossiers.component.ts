import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {READFILEURL } from '../../shared/model/request-util';
import {CreditComityService} from './credit-comity.service';
import {LanguesService} from "../../shared/myTranslation/langues";
import {StateService} from "../../shared/state/statistiques";
import {UserData} from '../../shared';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreditComityDossierDeleteDialogComponent} from './credit-comity-dossier-delete-dialog.component';

import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from "ng-jhipster";
import {SPClientService} from '../../shared/sp-client.service';
import {Subscription} from 'rxjs';
import {LigneRequestService} from '../ligne-request/ligne-request.service';
declare let select_init: any;

// @Component({
//     selector: 'jhi-credit-comity-dossiers',
//     templateUrl: './credit-commity-dossiers.component.html'
// })
// export class CreditComityDossiersComponent {
//     public creditComity: CreditComity;
//
//     constructor(
//         private _creditComityService: CreditComityService,
//         // public activeModal: NgbActiveModal,
//         private eventManager: JhiEventManager,
//         private paginationUtil: JhiPaginationUtil,
//         private parseLinks: JhiParseLinks,
//         private alertService: JhiAlertService,
//         private _alertService: JhiAlertService,
//         private _eventManager: JhiEventManager,
//         private _activatedRoute: ActivatedRoute,
//         // public langue: LanguesService,
//     ) {
//         this.creditComity = null;
//     }
//
//
//
//
// }

@Component({
    selector: 'jhi-credit-comity-dossiers',
    templateUrl: './credit-commity-dossiers.component.html'
})
export class CreditCommityDossiersComponent implements OnInit, OnDestroy {
    routeSub: any;
    public creditComityId: number;
    private _currentCreditComityDossiers: any[] = [];
    private _currentCreditComityFicheDossiers: any[];
    private _DePage: any;
    private imageUrl = READFILEURL;
    synthesis = {};
    queryParams: any = {};
    eventSubscriber: Subscription;
    retirer = false;

    constructor(
        private route: ActivatedRoute,
        public langue: LanguesService,
        private creditComityService: CreditComityService,
        public _stateService: StateService,
        private modalService: NgbModal,
        public _spClientService: SPClientService,
        public _ligneRequestService: LigneRequestService,
        private eventManager: JhiEventManager,
        // private creditComityPopupService: CreditComityPopupService
    ) {}

    ngAfterViewInit() {
        select_init();
    }

    deleteDossier(dossier) {
        const modalRef = this.modalService.open(CreditComityDossierDeleteDialogComponent as Component, {
            keyboard: false,
            size: 'lg',
            backdrop: 'static'
        });
        modalRef.componentInstance.dossier = dossier;
    }

    get currentCreditComityDossiers(): any[] {
        return this._currentCreditComityDossiers;
    }

    public showDossiers(creditComityId: number): void {
        this.creditComityService.showDossier(creditComityId)
            .subscribe((data) => {
                this._currentCreditComityDossiers = data;
                select_init();
            });
    }

    ngOnInit(): void {
        this._DePage = UserData.getInstance().sfd_;
        this.routeSub = this.route.params.subscribe((params: any[]) => {
            this.creditComityId = parseInt(params['id']);
            this.showDossiers(this.creditComityId);
            this._getSynthese();
            this._checkIfCreditComityInLigneRequest();
        });

        this.queryParams = this.route.snapshot.queryParams;

        this.eventSubscriber = this.eventManager.subscribe('creditComityDossiers', () => {
            this.showDossiers(this.creditComityId);
            this._getSynthese();
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();

        if(this.eventSubscriber) {
            this.eventManager.destroy(this.eventSubscriber);
        }
    }

    public showFicheDossiersModal(creditComityDossierId: number): void {
        this.creditComityService.showFicheDossier(creditComityDossierId)
        .subscribe((data) => {
            if (data[0].reference != null) {
                this._currentCreditComityFicheDossiers = data;
            }
            // modalHide('#credit-comity-dossiers-modal');
            // modal('#credit-comity-fiche-dossiers-modal');
            //  this._stateService.printAsPdf()
        });
    }

    private _getSynthese() {
        this._spClientService.syntheseCreditComity(this.creditComityId)
            .subscribe(
                (synthesis) => {
                    this.synthesis = synthesis;
                },
                () => {

                }
            );
    }

    private _checkIfCreditComityInLigneRequest() {
        this._ligneRequestService.creditComityInLigneRequest(this.creditComityId)
        .then((r) => {
            this.retirer = !r;
        })
        .catch(() => {
            this.retirer = false;
        });
    }

    get dossierIncomplets(): boolean {
        return this.queryParams.dossierComplets === 'false';
    }

    total() {
        let amount = 0;
        let benef = 0;
        let montant_decaisse = 0;

        for (let d of this.currentCreditComityDossiers) {
            amount += d.amount;
            benef += d.nbr_membre;
            montant_decaisse += d.montant_decaisse;
        }

        return {
            amount,
            benef,
            montant_decaisse,
        };
    }
}
