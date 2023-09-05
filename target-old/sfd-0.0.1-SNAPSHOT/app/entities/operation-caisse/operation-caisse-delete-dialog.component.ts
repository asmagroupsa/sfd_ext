import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { OperationCaisse } from './operation-caisse.model';
import { OperationCaissePopupService } from './operation-caisse-popup.service';
import { OperationCaisseService } from './operation-caisse.service';

@Component({
  selector: 'jhi-operation-caisse-delete-dialog',
  templateUrl: './operation-caisse-delete-dialog.component.html'
})
export class OperationCaisseDeleteDialogComponent {
  OperationCaisse: OperationCaisse;

  constructor(
    private OperationCaisseService: OperationCaisseService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.OperationCaisseService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'OperationCaisseListModification',
        content: 'Deleted an OperationCaisse'
      });
      this.activeModal.dismiss(true);
      this.alertService.success(
        'carmesfnmserviceApp.OperationCaisse.deleted',
        { param: id },
        null
      );
    }, (e) => {
      this.alertService.success(
        'carmesfnmserviceApp.OperationCaisse.deleted',
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
export class OperationCaisseDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private OperationCaissePopupService: OperationCaissePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.OperationCaissePopupService.open(
        OperationCaisseDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
