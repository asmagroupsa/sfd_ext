import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Subscription } from 'rxjs';
import { RequestPartner, Partneriat } from './request-patner.model';
import { RequestPartnerService } from './request-patner.service';
import { RequestPartnerPopupService } from './request-patner-popup.service';

@Component({
    selector: 'jhi-request-partner-confirm-dialog',
    templateUrl: './request-patner-confirm-dialog.component.html'
})

export class RequestPatnerConfirmComponent {

    requestPartner: RequestPartner;
    private subscription: Subscription;

    constructor(
        private requestPatnerService: RequestPartnerService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute
    ) { }


    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmValidation(model: RequestPartner) {
        model.etat = 'VALIDER';
        this.requestPatnerService.update(model).subscribe((response) => {
            if (response.id) {
                let parteniat = new Partneriat();
                parteniat.code_partenaire = response.partner.code;
                parteniat.code_sfd = response.sfd.code;
                parteniat.demandePartenariat = {id: response.id};
                this.requestPatnerService.createParteneriat(parteniat).subscribe((response) => {
                    this.eventManager.broadcast({
                        name: 'produitListModification',
                        content: 'confirm an demande'
                    });
                    this.activeModal.dismiss(true);
                });
            }
            this.alertService.success('Demande confirmer avec succes');
            console.log(model);
        });


    }
}

@Component({
    selector: 'jhi-request-partner-confirm-popup',
    template: ''
})
export class RequestPatnerConfirmPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private RequestPatnerPopupService: RequestPartnerPopupService
    ) { }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.RequestPatnerPopupService
                .open(RequestPatnerConfirmComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
