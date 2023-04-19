import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CreditRequestStatus } from './credit-request-status.model';
import { CreditRequestStatusPopupService } from './credit-request-status-popup.service';
import { CreditRequestStatusService } from './credit-request-status.service';

@Component({
  selector: 'jhi-credit-request-status-delete-dialog',
  templateUrl: './credit-request-status-delete-dialog.component.html'
})
export class CreditRequestStatusDeleteDialogComponent {
  creditRequestStatus: CreditRequestStatus;

  constructor(
    private creditRequestStatusService: CreditRequestStatusService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.creditRequestStatusService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'creditRequestStatusListModification',
        content: 'Deleted an creditRequestStatus'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.creditRequestStatus.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.creditRequestStatus.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-credit-request-status-delete-popup',
  template: ''
})
export class CreditRequestStatusDeletePopupComponent
  implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private creditRequestStatusPopupService: CreditRequestStatusPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.creditRequestStatusPopupService.open(
        CreditRequestStatusDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
