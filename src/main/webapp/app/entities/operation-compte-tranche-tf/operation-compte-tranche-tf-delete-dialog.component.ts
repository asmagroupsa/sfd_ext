import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { OperationCompteTrancheTF } from './operation-compte-tranche-tf.model';
import { OperationCompteTrancheTFPopupService } from './operation-compte-tranche-tf-popup.service';
import { OperationCompteTrancheTFService } from './operation-compte-tranche-tf.service';

@Component({
  selector: 'jhi-operation-compte-tranche-tf-delete-dialog',
  templateUrl: './operation-compte-tranche-tf-delete-dialog.component.html'
})
export class OperationCompteTrancheTFDeleteDialogComponent {
  operationCompteTrancheTF: OperationCompteTrancheTF;

  constructor(
    private operationCompteTrancheTFService: OperationCompteTrancheTFService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.operationCompteTrancheTFService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'operationCompteTrancheTFListModification',
        content: 'Deleted an operationCompteTrancheTF'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.operationCompteTrancheTF.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.operationCompteTrancheTF.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-operation-compte-tranche-tf-delete-popup',
  template: ''
})
export class OperationCompteTrancheTFDeletePopupComponent
  implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private operationCompteTrancheTFPopupService: OperationCompteTrancheTFPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.operationCompteTrancheTFPopupService.open(
        OperationCompteTrancheTFDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
