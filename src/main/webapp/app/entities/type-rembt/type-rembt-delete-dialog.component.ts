import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TypeRembt } from './type-rembt.model';
import { TypeRembtPopupService } from './type-rembt-popup.service';
import { TypeRembtService } from './type-rembt.service';

@Component({
  selector: 'jhi-type-rembt-delete-dialog',
  templateUrl: './type-rembt-delete-dialog.component.html'
})
export class TypeRembtDeleteDialogComponent {
  typeRembt: TypeRembt;

  constructor(
    private typeRembtService: TypeRembtService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.typeRembtService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'typeRembtListModification',
        content: 'Deleted an typeRembt'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.typeRembt.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.typeRembt.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-type-rembt-delete-popup',
  template: ''
})
export class TypeRembtDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeRembtPopupService: TypeRembtPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.typeRembtPopupService.open(
        TypeRembtDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
