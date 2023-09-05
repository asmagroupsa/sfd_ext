import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SPUtilService } from '../../shared/sp-util.service';


@Component({
    selector: 'jhi-solde-ligne-credit-dialog',
    templateUrl: './solde-ligne-credit-dialog.component.html'
})
export class SoldeLigneCreditDialogDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    ligneCredit;
    solde: number;
    m: any = {};

    constructor(
        public activeModal: NgbActiveModal,
        private _spUtilService: SPUtilService,
    ) { }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    ngOnInit() {
        if (!this.ligneCredit) {
            this.activeModal.close();
            return;
        }

        this._spUtilService.soldeLigneCredit(this.ligneCredit.id)
            .subscribe(
                (solde) => {
                    this.solde = solde;
                }
            );
    }

    ngAfterViewInit() {
        const m: HTMLElement = document.querySelector('ngb-modal-window') as HTMLElement;

        if (m) {
            this.m = {
                backgroundColor: m.style.backgroundColor,
                boxShadow: m.style.boxShadow
            };

            m.style.backgroundColor = 'unset';
            m.style.boxShadow = 'unset';
        }
    }

    ngOnDestroy() {
        const m: HTMLElement = document.querySelector('ngb-modal-window') as HTMLElement;

        if (this.m && m) {
            m.style.backgroundColor = this.m.backgroundColor;
            m.style.boxShadow = this.m.boxShadow;
        }
    }
}
