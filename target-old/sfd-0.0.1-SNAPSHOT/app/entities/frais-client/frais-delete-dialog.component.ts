import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Frais } from './frais.model';
import { FraisPopupService } from './frais-popup.service';
import { FraisService } from './frais.service';

@Component({
  selector: 'jhi-frais-delete-dialog',
  templateUrl: './frais-delete-dialog.component.html'
})
export class FraisDeleteDialogComponent {
  frais: Frais;

  constructor(
    private fraisService: FraisService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.fraisService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'fraisListModification',
        content: 'Deleted an frais'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.frais.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.frais.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-frais-delete-popup',
  template: ''
})
export class FraisDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private fraisPopupService: FraisPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.fraisPopupService.open(
        FraisDeleteDialogComponent as Component,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
