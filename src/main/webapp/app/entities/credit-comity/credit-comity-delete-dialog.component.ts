import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CreditComity } from './credit-comity.model';
import { CreditComityPopupService } from './credit-comity-popup.service';
import { CreditComityService } from './credit-comity.service';

@Component({
  selector: 'jhi-credit-comity-delete-dialog',
  templateUrl: './credit-comity-delete-dialog.component.html'
})
export class CreditComityDeleteDialogComponent {
  creditComity: CreditComity;

  constructor(
    private creditComityService: CreditComityService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.creditComityService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'creditComityListModification',
        content: 'Deleted an creditComity'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.creditComity.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.creditComity.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-credit-comity-delete-popup',
  template: ''
})
export class CreditComityDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private creditComityPopupService: CreditComityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.creditComityPopupService.open(
        CreditComityDeleteDialogComponent as Component,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
