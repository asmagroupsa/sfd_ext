import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Rembt } from './rembt.model';
import { RembtPopupService } from './rembt-popup.service';
import { RembtService } from './rembt.service';

@Component({
  selector: 'jhi-rembt-delete-dialog',
  templateUrl: './rembt-delete-dialog.component.html'
})
export class RembtDeleteDialogComponent {
  rembt: Rembt;

  constructor(
    private rembtService: RembtService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.rembtService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'rembtListModification',
        content: 'Deleted an rembt'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.rembt.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.rembt.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-rembt-delete-popup',
  template: ''
})
export class RembtDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private rembtPopupService: RembtPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.rembtPopupService.open(
        RembtDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
