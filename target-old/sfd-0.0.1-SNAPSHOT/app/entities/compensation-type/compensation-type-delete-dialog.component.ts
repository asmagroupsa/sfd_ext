import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CompensationType } from './compensation-type.model';
import { CompensationTypePopupService } from './compensation-type-popup.service';
import { CompensationTypeService } from './compensation-type.service';

@Component({
  selector: 'jhi-compensation-type-delete-dialog',
  templateUrl: './compensation-type-delete-dialog.component.html'
})
export class CompensationTypeDeleteDialogComponent {
  compensationType: CompensationType;

  constructor(
    private compensationTypeService: CompensationTypeService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.compensationTypeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'compensationTypeListModification',
        content: 'Deleted an compensationType'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.compensationType.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.compensationType.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-compensation-type-delete-popup',
  template: ''
})
export class CompensationTypeDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private compensationTypePopupService: CompensationTypePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.compensationTypePopupService.open(
        CompensationTypeDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
