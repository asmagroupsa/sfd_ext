import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TrancheTauxFrais } from './tranche-taux-frais.model';
import { TrancheTauxFraisPopupService } from './tranche-taux-frais-popup.service';
import { TrancheTauxFraisService } from './tranche-taux-frais.service';

@Component({
  selector: 'jhi-tranche-taux-frais-delete-dialog',
  templateUrl: './tranche-taux-frais-delete-dialog.component.html'
})
export class TrancheTauxFraisDeleteDialogComponent {
  trancheTauxFrais: TrancheTauxFrais;

  constructor(
    private trancheTauxFraisService: TrancheTauxFraisService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.trancheTauxFraisService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'trancheTauxFraisListModification',
        content: 'Deleted an trancheTauxFrais'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.trancheTauxFrais.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.trancheTauxFrais.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-tranche-taux-frais-delete-popup',
  template: ''
})
export class TrancheTauxFraisDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private trancheTauxFraisPopupService: TrancheTauxFraisPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.trancheTauxFraisPopupService.open(
        TrancheTauxFraisDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
