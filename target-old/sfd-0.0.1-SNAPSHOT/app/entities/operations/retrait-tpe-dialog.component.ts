import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService} from 'ng-jhipster';
import {OperationService} from '.';
import { UserData} from '../../shared';


export interface model {
    carmes_account?: number;
    amount?: string;
}


@Component({
    selector: 'jhi-retrait-tpe-dialog',
    templateUrl: './retrait-tpe-dialog.component.html'
})
export class RetraitTPEDialogComponent implements OnInit {
    authorities: any[];
    model: model = {};
    loading = {save: false};
    formated_amount: string;
    l = [];

    constructor(
        public activeModal: NgbActiveModal,
        private _alertService: JhiAlertService,
        private _operationService: OperationService
    ) {}

    ngOnInit() {
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.loading.save = true;
        this._operationService.listeCreditTPE(this.model.carmes_account)
        .then((l) => {
            this.loading.save = false
            
            if (l) {
                this.l = l.filter((e) => e.id !== null);
                if (this.l.length === 0) this._alertService.error(`CE COMPTE N' AS PAS DE RETRAIT`);
            } else this._alertService.error(`CE COMPTE N'AS PAS DE RETRAIT`);
        })
        .catch(() => {
            this.loading.save = false;
        });
    }

    rf(r) {
        if (!r.id) return;
        
        if (confirm('Confirmer le retrait de ' + r.amount + ' FCFA sur le compte ' + r.cpte_carmes)) {
            this.loading.save = true;

            this._operationService.retraitTPE(r)
            .subscribe((res) => {
                let resp = res.json().resultat;
                this.loading.save = false

                if (resp === 'COMPTE_AGENT_ERRONEE') this._alertService.error('COMPTE ERRONE');
                else if (resp === 'SOLDE_INSUFFISANT') this._alertService.error('SOLDE INSUFFISANT');
                else {
                    this._alertService.success('RETRAIT EFFECTUEE AVEC SUCCES');
                    this.l = this.l.filter((e) => e.id !== r.id);
                    
                    UserData.getInstance().compensationData[0] = r;
                    this.activeModal.close(r);
                }
            }, () => {
                this.loading.save = false
                this._alertService.error(`ERREUR, IMPOSSIBLE D' EFFECTUER LE RETRAIT`);
            });
        }
    }
}
