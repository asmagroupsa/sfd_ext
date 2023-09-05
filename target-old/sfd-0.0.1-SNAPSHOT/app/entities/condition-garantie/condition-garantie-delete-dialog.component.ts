import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { ConditionGarantie } from './condition-garantie.model';
import { ConditionGarantiePopupService } from './condition-garantie-popup.service';
import { ConditionGarantieService } from './condition-garantie.service';

@Component({
  selector: 'jhi-condition-garantie-delete-dialog',
  templateUrl: './condition-garantie-delete-dialog.component.html'
})
export class ConditionGarantieDeleteDialogComponent {
  conditionGarantie: ConditionGarantie;

  constructor(
    private conditionGarantieService: ConditionGarantieService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.conditionGarantieService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'conditionGarantieListModification',
        content: 'Deleted an conditionGarantie'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.conditionGarantie.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.conditionGarantie.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-condition-garantie-delete-popup',
  template: ''
})
export class ConditionGarantieDeletePopupComponent
  implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private conditionGarantiePopupService: ConditionGarantiePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.conditionGarantiePopupService.open(
        ConditionGarantieDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
