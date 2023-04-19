import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { CompteCommission } from './compte-commission.model';
import { CompteCommissionPopupService } from './compte-commission-popup.service';
import { CompteCommissionService } from './compte-commission.service';

@Component({
  selector: 'jhi-compte-commission-delete-dialog',
  templateUrl: './compte-commission-delete-dialog.component.html'
})
export class CompteCommissionDeleteDialogComponent {
  compteCommission: CompteCommission;

  constructor(
    private compteCommissionService: CompteCommissionService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.compteCommissionService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'compteCommissionListModification',
        content: 'Deleted an compteCommission'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.compteCommission.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.compteCommission.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-compte-commission-delete-popup',
  template: ''
})
export class CompteCommissionDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private compteCommissionPopupService: CompteCommissionPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.compteCommissionPopupService.open(
        CompteCommissionDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
