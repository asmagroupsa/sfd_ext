import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Conditions } from './conditions.model';
import { ConditionsPopupService } from './conditions-popup.service';
import { ConditionsService } from './conditions.service';

@Component({
  selector: 'jhi-conditions-delete-dialog',
  templateUrl: './conditions-delete-dialog.component.html'
})
export class ConditionsDeleteDialogComponent {
  conditions: Conditions;

  constructor(
    private conditionsService: ConditionsService,
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
  selector: 'jhi-conditions-delete-popup',
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
