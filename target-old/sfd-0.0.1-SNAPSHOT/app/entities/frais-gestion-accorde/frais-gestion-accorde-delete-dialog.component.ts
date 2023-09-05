import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { FraisGestionAccorde } from './frais-gestion-accorde.model';
import { FraisGestionAccordePopupService } from './frais-gestion-accorde-popup.service';
import { FraisGestionAccordeService } from './frais-gestion-accorde.service';

@Component({
  selector: 'jhi-frais-gestion-accorde-delete-dialog',
  templateUrl: './frais-gestion-accorde-delete-dialog.component.html'
})
export class FraisGestionAccordeDeleteDialogComponent {
  fraisGestionAccorde: FraisGestionAccorde;

  constructor(
    private fraisGestionAccordeService: FraisGestionAccordeService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.fraisGestionAccordeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'fraisGestionAccordeListModification',
        content: 'Deleted an fraisGestionAccorde'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.fraisGestionAccorde.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.fraisGestionAccorde.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-frais-gestion-accorde-delete-popup',
  template: ''
})
export class FraisGestionAccordeDeletePopupComponent
  implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private fraisGestionAccordePopupService: FraisGestionAccordePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.fraisGestionAccordePopupService.open(
        FraisGestionAccordeDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
