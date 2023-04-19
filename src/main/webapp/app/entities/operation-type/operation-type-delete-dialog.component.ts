import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { OperationType } from './operation-type.model';
import { OperationTypePopupService } from './operation-type-popup.service';
import { OperationTypeService } from './operation-type.service';

@Component({
  selector: 'jhi-operation-type-delete-dialog',
  templateUrl: './operation-type-delete-dialog.component.html'
})
export class OperationTypeDeleteDialogComponent {
  operationType: OperationType;

  constructor(
    private operationTypeService: OperationTypeService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.operationTypeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'operationTypeListModification',
        content: 'Deleted an operationType'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.operationType.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.operationType.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-operation-type-delete-popup',
  template: ''
})
export class OperationTypeDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private operationTypePopupService: OperationTypePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.operationTypePopupService.open(
        OperationTypeDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
