import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {SPFNMService} from "../../shared/sp-fnm.service";
import {UserData} from "../../shared/index";
import {JhiAlertService} from "ng-jhipster";

declare const select_init;

@Component({
    selector: 'jhi-associer-ligne-credit-comite',
    templateUrl: './associer-ligne-credit-comite.component.html'
})
export class AssocierLigneCreditComiteComponent implements OnInit, AfterViewInit, OnDestroy {
    lignes = [];
    private _m;
    creditComity: any = {};
    ligne_credit_id;
    isSaving = false;

    constructor(
        public activeModal: NgbActiveModal,
        private _spFNMService: SPFNMService,
        private _alertService: JhiAlertService,
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    ngOnInit() {
        this._spFNMService.listeLigneNonEpuise()
        .then((lignes) => {
            this.lignes = lignes;
            select_init();
        });
    }

    ngAfterViewInit() {
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
        this._spFNMService.associerLigneCreditComite({
            ligne_credit_id: this.ligne_credit_id,
            credit_comity_id: this.creditComity.id,
        })
        .then(() => {
            this._alertService.success('Ligne associée');
            this.activeModal.dismiss();
        })
        .catch((e) => {
            console.error(e);
            this._alertService.error('Erreur');
        })
    }
}
