import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { DelegatedMember } from './delegated-member.model';
import { DelegatedMemberPopupService } from './delegated-member-popup.service';
import { DelegatedMemberService } from './delegated-member.service';

@Component({
    selector: 'jhi-delegated-member-delete-dialog',
    templateUrl: './delegated-member-delete-dialog.component.html'
})
export class DelegatedMemberDeleteDialogComponent {

    delegatedMember: DelegatedMember;

    constructor(
        private delegatedMemberService: DelegatedMemberService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.delegatedMemberService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'delegatedMemberListModification',
                content: 'Deleted an delegatedMember'
            });
            this.activeModal.dismiss(true);
            this.alertService.success('sfdApp.carmesfnmserviceApp.delegatedMember.deleted', { param: id }, null);
          }, (e) => {
            this.alertService.error('sfdApp.carmesfnmserviceApp.delegatedMember.deleted', { param: id }, null);
        });
    }
}

@Component({
    selector: 'jhi-delegated-member-delete-popup',
    template: ''
})
export class DelegatedMemberDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private delegatedMemberPopupService: DelegatedMemberPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.delegatedMemberPopupService
                .open(DelegatedMemberDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
