import {Component, OnInit} from '@angular/core';
import {SPStdAloneService, TransfertBankCoffreParams} from '../../shared/sp-stdalone.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService} from 'ng-jhipster';
import {BankAccountClientService} from '../bank-account-client/bank-account-client.service';
import {SPUtilService} from '../../shared/sp-util.service';
import {UserData} from '../../shared';

declare let select_init: any;

@Component({
    selector: 'jhi-transfert-bank-coffre-dialog',
    templateUrl: './transfert-bank-coffre-dialog.component.html'
})
export class TransfertBankCoffreDialogComponent implements OnInit {
    model: TransfertBankCoffreParams = {};
    isSaving = false;
    banks = [];
    montant: string;
    coffre = '';

    constructor(
        private _spStdAloneService: SPStdAloneService,
        public ngbActiveModal: NgbActiveModal,
        private _alertService: JhiAlertService,
        private _SPUtilService: SPUtilService,
    ) {}

    ngAfterContentInit() {
        select_init();
    }

    ngOnInit() {
        this._SPUtilService.listeCompteBankActeur(UserData.getInstance().getSFD().compteCarmes).toPromise()
        .then((data) => {
            this.banks = data;
        })
        .catch(console.log);
    }

    save() {
        /* if (!this.model.num_compte_bank) {
            return;
        }

        const b = this.banks.find((i) => i.numAccount === this.model.num_compte_bank);

        if (!b) {
            return;
        }

        if (!b.bank) {
            return;
        }

        this.model.bank_id = b.bank.id; */

        this.isSaving = true;

        this._spStdAloneService.transfertBankCoffre(this.model)
        .then(() => {
            this.isSaving = false;
            this.ngbActiveModal.dismiss();
        })
        .catch(() => {
            this.isSaving = false;
            this._alertService.error('Erreur');
        });
    }
}
