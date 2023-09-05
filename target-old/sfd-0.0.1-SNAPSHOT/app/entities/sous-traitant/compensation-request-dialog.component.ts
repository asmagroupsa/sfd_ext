import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {SPFNMService} from "../../shared/sp-fnm.service";
import {UserData} from "../../shared/index";
import {JhiAlertService, JhiEventManager} from "ng-jhipster";

declare const select_init;

@Component({
    selector: 'jhi-compensation-request-dialog.component.html',
    templateUrl: './compensation-request-dialog.component.html'
})
export class CompensationRequestDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    // lignes = [];
    private _m;
    // creditComity: any = {};
    // ligne_credit_id;
    isSaving = false;
    model: any = {};

    constructor(
        public activeModal: NgbActiveModal,
        private _spFNMService: SPFNMService,
        private _alertService: JhiAlertService,
        private eventManager: JhiEventManager,
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    async ngOnInit() {
        // this._spFNMService.listeLigneNonEpuise()
        // .then((lignes) => {
        //     this.lignes = lignes;
        //     select_init();
        // });
    }

    ngAfterViewInit() {
        select_init();
        const m: HTMLElement = document.querySelector('ngb-modal-window') as HTMLElement;

        if (m) {
            this._m = {
                backgroundColor: m.style.backgroundColor,
                boxShadow: m.style.boxShadow
            };

            m.style.backgroundColor = 'unset';
            m.style.boxShadow = 'unset';
        }
    }

    ngOnDestroy() {
        const m: HTMLElement = document.querySelector('ngb-modal-window') as HTMLElement;

        if (this._m && m) {
            m.style.backgroundColor = this._m.backgroundColor;
            m.style.boxShadow = this._m.boxShadow;
        }
    }

    save() {
        this.model.created_by = UserData.getInstance().userReference;
        this._spFNMService.insertionRequestCompensation(this.model)
        .then(() => {
            this._alertService.success('Demande effectuée');
            this.eventManager.broadcast({
                name: 'sousTraitantCompensationRequestListModification',
                content: 'OK'
            });
            this.activeModal.dismiss();
        })
        .catch((e) => {
            console.error(e);
            this._alertService.error('Erreur');
        })
    }

    solde() {
        this.model.comptecarmes = UserData.getInstance().account.login;

        this._spFNMService.verifierSoldeCompensationMarchand(this.model)
        .then((solde) => {
            this.model.amount = solde;
        })
        .catch((e) => {
            console.log(e);
            let m = 'Erreur';

            if (typeof e === 'string') {
                m = e.replace(/_/g, ' ');
            }

            this._alertService.error(m);
        });
    }

    onTypeChange() {
        this.model.amount = undefined;
    }
}
