import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Compensation } from './compensation.model';
import { CompensationPopupService } from './compensation-popup.service';
import { CompensationService } from './compensation.service';

@Component({
  selector: 'jhi-compensation-delete-dialog',
  templateUrl: './compensation-delete-dialog.component.html'
})
export class CompensationDeleteDialogComponent {
  compensation: Compensation;

  constructor(
    private compensationService: CompensationService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.compensationService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'compensationListModification',
        content: 'Deleted an compensation'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.compensation.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.compensation.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-compensation-delete-popup',
  template: ''
})
export class CompensationDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private compensationPopupService: CompensationPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.compensationPopupService.open(
        CompensationDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
