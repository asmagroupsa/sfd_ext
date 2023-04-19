import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Commission } from './commission.model';
import { CommissionPopupService } from './commission-popup.service';
import { CommissionService } from './commission.service';

@Component({
  selector: 'jhi-commission-delete-dialog',
  templateUrl: './commission-delete-dialog.component.html'
})
export class CommissionDeleteDialogComponent {
  commission: Commission;

  constructor(
    private commissionService: CommissionService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.commissionService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'commissionListModification',
        content: 'Deleted an commission'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.commission.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.commission.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-commission-delete-popup',
  template: ''
})
export class CommissionDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private commissionPopupService: CommissionPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.commissionPopupService.open(
        CommissionDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
