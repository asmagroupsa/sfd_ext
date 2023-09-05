import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { IdCardType } from './id-card-type.model';
import { IdCardTypePopupService } from './id-card-type-popup.service';
import { IdCardTypeService } from './id-card-type.service';

@Component({
  selector: 'jhi-id-card-type-delete-dialog',
  templateUrl: './id-card-type-delete-dialog.component.html'
})
export class IdCardTypeDeleteDialogComponent {
  idCardType: IdCardType;

  constructor(
    private idCardTypeService: IdCardTypeService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.idCardTypeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'idCardTypeListModification',
        content: 'Deleted an idCardType'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.idCardType.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.idCardType.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-id-card-type-delete-popup',
  template: ''
})
export class IdCardTypeDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private idCardTypePopupService: IdCardTypePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.idCardTypePopupService.open(
        IdCardTypeDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
