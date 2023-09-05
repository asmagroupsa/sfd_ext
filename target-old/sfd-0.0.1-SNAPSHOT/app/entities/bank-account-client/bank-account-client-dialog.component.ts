import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Response} from '@angular/http';

import {Observable} from 'rxjs';
import {NgbActiveModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';

import {BankAccountClient} from './bank-account-client.model';
import {BankAccountClientPopupService} from './bank-account-client-popup.service';
import {BankAccountClientService} from './bank-account-client.service';
import {UserData, setCreateBy, Principal, setLastModifyBy} from '../../shared';
import {BankService} from '../bank/bank.service';
import {ClientService} from '../client';
declare let select_init:any;
@Component({
    selector: 'jhi-bank-account-client-dialog',
    templateUrl: './bank-account-client-dialog.component.html'
})
export class BankAccountClientDialogComponent implements OnInit {

    bankAccountClient: BankAccountClient;
    banks = [];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private _bankAccountClientService: BankAccountClientService,
        private _bankService: BankService,
        private eventManager: JhiEventManager,
        private _principal: Principal,
        private _clientService: ClientService,
    ) {}
ngAfterViewInit(){
    select_init();
}
    ngOnInit() {
        if (UserData.getInstance().sfd_ && !UserData.getInstance().sfd_.compteCarmes) {
            this.clear();
            return;
        }

        this._getBanks();
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;

        this._principal.identity()
        .then((identity) => {
            if (this.bankAccountClient.id !== undefined) {
                setLastModifyBy(this.bankAccountClient, identity);
                this.subscribeToSaveResponse(this._bankAccountClientService.update(this.bankAccountClient), false);
            } else {
                setCreateBy(this.bankAccountClient, identity);

                this._clientService.query({
                    NO_QUERY: true,
                    'cpteCarmes.equals': UserData.getInstance().sfd_.compteCarmes,
                })
                .subscribe(
                    (r) => {
                        const json = r.json;

                        if (json.length != 1) {
                            this.isSaving = false;
                            this.alertService.error('Erreur');
                            return;
                        }
                        
                        this.bankAccountClient.clientId = json[0].id;
                        this.subscribeToSaveResponse(this._bankAccountClientService.create(this.bankAccountClient), true);
                    },
                    () => {
                        this.isSaving = false;
                        this.alertService.error('Erreur');
                    }
                );

            }
        });
    }

    private subscribeToSaveResponse(result: Observable<BankAccountClient>, isCreated: boolean) {
        result.subscribe((res: BankAccountClient) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: BankAccountClient, isCreated: boolean) {
        this.alertService.success(isCreated ? 'carmesfnmserviceApp.bankAccountClient.created' : 'carmesfnmserviceApp.bankAccountClient.updated');
        this.eventManager.broadcast({name: 'bankListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.alertService.error('Erreur');
        this.isSaving = false;
    }

    private onError(error: any) {
        this.alertService.error(error.message, null, null);
    }

    private _getBanks() {
        this._bankService.query().subscribe(
            (r) => {
                this.banks = r.json;
            },
            () => {

            }
        );
    }
}

@Component({
    selector: 'jhi-bank-popup',
    template: ''
})
export class BankAccountClientPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private bankPopupService: BankAccountClientPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if (params['id']) {
                this.bankPopupService
                    .open(BankAccountClientDialogComponent as Component, params['id']);
            } else {
                this.bankPopupService
                    .open(BankAccountClientDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
