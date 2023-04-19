import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService} from 'ng-jhipster';
import {OperationService} from '.';
import { UserData} from '../../shared';
import { CompteService } from '../compte';
import { Subscription } from 'rxjs';

declare const accordion: any;

export type DepotLocalModelType = {
    compteClient?: string;
    montant?: string;
};


@Component({
    selector: 'jhi-depot-retrait-local-dialog',
    templateUrl: './depot-retrait-local-dialog.component.html'
})
export class DepotRetraitLocalDialogComponent implements OnInit {
    authorities: any[];
    model: DepotLocalModelType = {};
    data:any={};
    loading = {save: false};
    modelMontant: string;
    save_ = false;
    r = false;
    c: any;
    o = 'depot';
    cs = [];
    searchCompteByFieldSubscription: Subscription;

    constructor(
        public activeModal: NgbActiveModal,
        private _alertService: JhiAlertService,
        private _compteService: CompteService,
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

        this._operationService.operationLocalSFD(this.model, this.o)
        .subscribe(
            (r) => {
                this.loading.save = false;
                switch (r) {
                    case 'COMPTE_CLIENT_ERRONEE':
                        this._alertService.error('COMPTE CLIENT ERRONEE');
                    break;
                    case 'SOLDE_CLIENT_INSUFFISANT':
                        this._alertService.error('Le solde du client est insuffisant');
                    break;
                    case 'SOLDE_GUICHET_INSUFFISANT':
                        this._alertService.error('Le solde du guichetier est insuffisant');
                    break;
                    case 'NON':
                        this._alertService.error(`Une erreur s'est produite!!! Veuillez réessayer!`);
                    break;
                    case 'COMPTE_AGENT_ERRONEE':
                        this._alertService.error('GUICHETIER INEXISTANT');
                    break;
                    default:
                        this._alertService.success(`L'opération a été effectué avec succès`);
                        this.data.amount = this.model.montant;
                        this.data.type = this.o
                        this.data.client = r;
                        UserData.getInstance().compensationData[0] = this.data;
                        this.activeModal.close(r);  
                    break;
                }
            },
            () => {
                this.loading.save = false;
                this._alertService.error(`Une erreur s'est produite!!! Veuillez réessayer!`);
            }
        );
    }

    infoClient() {
        this.loading.save = true;
        this.save_ = false;
        this.r = false;

        this._compteService.query_({
            'numAccount.equals': this.model.compteClient,
            NO_QUERY: true
        })
        .subscribe(
            (cs) => {
                if (cs.json[0]) {
                    this.save_ = true;
                    this.c = cs.json[0];
                }
                else {
                    this.c = undefined;
                }

                this.loading.save = false;
            },
            () => {
                this.loading.save = false;
                this._alertService.error(undefined);
            }
        );
    }

    ngAfterViewInit() {
        accordion();
    }

    onNameBlur(name) {
        if (name.length >= 3) {
            if (this.searchCompteByFieldSubscription) this.searchCompteByFieldSubscription.unsubscribe();

            this.searchCompteByFieldSubscription = this._operationService.searchCompteByField('nom', name)
            .subscribe(
                (cs) => {
                    this.cs = cs.filter((c) => c.num_account.indexOf('E') != -1);
                }
            );
        }
    }
}
