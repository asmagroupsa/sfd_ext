import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { OperationDat } from './operation-dat.model';
import { OperationDatPopupService } from './operation-dat-popup.service';
import { OperationDatService } from './operation-dat.service';

@Component({
  selector: 'jhi-operation-dat-delete-dialog',
  templateUrl: './operation-dat-delete-dialog.component.html'
})
export class OperationDatDeleteDialogComponent {
  OperationDat: OperationDat;

  constructor(
    private OperationDatService: OperationDatService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.OperationDatService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'OperationDatListModification',
        content: 'Deleted an OperationDat'
      });
      this.activeModal.dismiss(true);
      this.alertService.success(
        'carmesfnmserviceApp.OperationDat.deleted',
        { param: id },
        null
      );
    }, (e) => {
      this.alertService.success(
        'carmesfnmserviceApp.OperationDat.deleted',
        { param: id },
        null
      );
    });
  }
}

@Component({
  selector: 'jhi-account-type-delete-popup',
  template: ''
})
export class OperationDatDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private OperationDatPopupService: OperationDatPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.OperationDatPopupService.open(
        OperationDatDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
