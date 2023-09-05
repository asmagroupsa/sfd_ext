
import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ElementRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Credit } from './credit.model';
import { CreditPopupService } from './credit-popup.service';
import { CreditService } from './credit.service';
import { UserData } from '../../shared';

import { Principal } from '../../shared/auth/principal.service';
import { LanguesService } from '../../shared/myTranslation/langues';
import { OperationService } from '../operations/operation.service';
declare let select_init: any;

@Component({
    selector: 'jhi-credit-en-cours-dialog',
    templateUrl: './credit-en-cours-dialog.component.html'
})

export class CreditEnCoursDialogComponent implements OnInit {
    montant: string;
    authorities: string[];
    isSaving: boolean;
    credit: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private creditService: CreditService,
        public langue: LanguesService,
        private operationService: OperationService,
        private eventManager: JhiEventManager,
        public principal: Principal
    ) { }

    ngAfterViewInit() {
        select_init();
    }
    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.principal.identity().then(
            (identity: any) => {
                if (this.credit.id !== undefined) {
                    this.subscribeToSaveResponse(
                        this.creditService.payerPenalite(this.credit.id, this.credit.name, this.montant),
                        true
                    );
                    UserData.getInstance().penaliteData.montant = this.montant;
                } else {
                    this.subscribeToSaveResponse(
                        this.creditService.payerPenalite(this.credit.id, this.credit.name, this.montant),
                        true
                    );
                    UserData.getInstance().penaliteData.montant =this.montant;
                }
            },
            () => { }
        );
    }
    private subscribeToSaveResponse(
        result: Observable<any>,
        isCreated: boolean
    ) {
        result.subscribe(
            (res: any) => this.onSaveSuccess(res, isCreated),
            (res: Response) => this.onSaveError(res)
        );
    }

    private onSaveSuccess(result: any, isCreated: boolean) {
        if (result.json.resultat && result.json.resultat.indexOf('*') != -1) {
            this.alertService.success(
                "Le paiement de la pénalité à été effectué",
                { param: this.credit.id },
                null
            );
            this.eventManager.broadcast({
                name: 'creditListModification',
                content: 'OK'
            });
            this.isSaving = false;
            UserData.getInstance().penaliteData.other = result.json.resultat;
            this.activeModal.close(result);
        } else if (result.json.resultat == 'COMPTE_AGENT_ERRONEE') {
            this.alertService.error(
                "Le compte de l'agent est erroné",
                null
            );
        } else {
            this.isSaving = false;
            this.alertService.error(
                "Une erreur s'est produite lors du paiement",
                { param: this.credit.id },
                null
            );
        }
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

}

@Component({
    selector: 'jhi-credit-en-cours-popup',
    template: ''
})
export class CreditEnCoursPopupComponent implements OnInit, OnDestroy {
    isSaving: boolean;
    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private creditPopupService: CreditPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if (params['id'] && params['penaliterestant']) {
                this.modalRef = this.creditPopupService.open(
                    CreditEnCoursDialogComponent as Component,
                    params['id'], params['penaliterestant']
                );
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
