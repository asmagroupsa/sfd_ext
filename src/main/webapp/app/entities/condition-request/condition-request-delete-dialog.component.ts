import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ConditionRequest } from './condition-request.model';
import { ConditionsPopupService } from './condition-request-popup.service';
import { ConditionRequestService } from './condition-request.service';

@Component({
  selector: 'jhi-condition-request-delete-dialog',
  templateUrl: './condition-request-delete-dialog.component.html'
})
export class ConditionsDeleteDialogComponent {
  conditions: ConditionRequest;

  constructor(
    private conditionsService: ConditionRequestService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.conditionsService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'conditionsListModification',
        content: 'Deleted an conditions'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.conditions.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.conditions.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-condition-request-delete-popup',
  template: ''
})
export class ConditionsDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private conditionsPopupService: ConditionsPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.conditionsPopupService.open(
        ConditionsDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
