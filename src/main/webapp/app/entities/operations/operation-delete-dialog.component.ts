import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Operation } from './operation.model';
import { OperationPopupService } from './operation-popup.service';
import { OperationService } from './operation.service';

@Component({
  selector: 'jhi-operation-delete-dialog',
  templateUrl: './operation-delete-dialog.component.html'
})
export class OperationDeleteDialogComponent {
  operation: Operation;

  constructor(
    private operationService: OperationService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.operationService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'operationListModification',
        content: 'Deleted an operation'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.operation.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.operation.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-operation-delete-popup',
  template: ''
})
export class OperationDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private operationPopupService: OperationPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.operationPopupService.open(
        OperationDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
