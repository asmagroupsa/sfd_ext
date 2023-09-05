import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { FraisGestion } from './frais-gestion.model';
import { FraisGestionPopupService } from './frais-gestion-popup.service';
import { FraisGestionService } from './frais-gestion.service';

@Component({
  selector: 'jhi-frais-gestion-delete-dialog',
  templateUrl: './frais-gestion-delete-dialog.component.html'
})
export class FraisGestionDeleteDialogComponent {
  fraisGestion: FraisGestion;

  constructor(
    private fraisGestionService: FraisGestionService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.fraisGestionService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'fraisGestionListModification',
        content: 'Deleted an fraisGestion'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.fraisGestion.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.fraisGestion.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-frais-gestion-delete-popup',
  template: ''
})
export class FraisGestionDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private fraisGestionPopupService: FraisGestionPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.fraisGestionPopupService.open(
        FraisGestionDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
