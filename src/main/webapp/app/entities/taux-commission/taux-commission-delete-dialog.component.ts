import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TauxCommission } from './taux-commission.model';
import { TauxCommissionPopupService } from './taux-commission-popup.service';
import { TauxCommissionService } from './taux-commission.service';

@Component({
  selector: 'jhi-taux-commission-delete-dialog',
  templateUrl: './taux-commission-delete-dialog.component.html'
})
export class TauxCommissionDeleteDialogComponent {
  tauxCommission: TauxCommission;

  constructor(
    private tauxCommissionService: TauxCommissionService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.tauxCommissionService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'tauxCommissionListModification',
        content: 'Deleted an tauxCommission'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.tauxCommission.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.tauxCommission.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-taux-commission-delete-popup',
  template: ''
})
export class TauxCommissionDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private tauxCommissionPopupService: TauxCommissionPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.tauxCommissionPopupService.open(
        TauxCommissionDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
