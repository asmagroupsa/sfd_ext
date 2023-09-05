import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CreditRequest } from './credit-request.model';
import { CreditRequestPopupService } from './credit-request-popup.service';
import { CreditRequestService } from './credit-request.service';

@Component({
  selector: 'jhi-credit-request-delete-dialog',
  templateUrl: './credit-request-delete-dialog.component.html'
})
export class CreditRequestDeleteDialogComponent {
  creditRequest: CreditRequest;

  constructor(
    private creditRequestService: CreditRequestService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.creditRequestService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'creditRequestListModification',
        content: 'Deleted an creditRequest'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.creditRequest.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.creditRequest.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-credit-request-delete-popup',
  template: ''
})
export class CreditRequestDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private creditRequestPopupService: CreditRequestPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.creditRequestPopupService.open(
        CreditRequestDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
