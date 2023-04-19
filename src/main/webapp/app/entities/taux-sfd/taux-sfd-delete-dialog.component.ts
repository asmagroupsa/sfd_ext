import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TauxSFD } from './taux-sfd.model';
import { TauxSFDPopupService } from './taux-sfd-popup.service';
import { TauxSFDService } from './taux-sfd.service';

@Component({
  selector: 'jhi-taux-sfd-delete-dialog',
  templateUrl: './taux-sfd-delete-dialog.component.html'
})
export class TauxSFDDeleteDialogComponent {
  tauxSFD: TauxSFD;

  constructor(
    private tauxSFDService: TauxSFDService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.tauxSFDService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'tauxSFDListModification',
        content: 'Deleted an tauxSFD'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.tauxSFD.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.tauxSFD.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-taux-sfd-delete-popup',
  template: ''
})
export class TauxSFDDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private tauxSFDPopupService: TauxSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.tauxSFDPopupService.open(
        TauxSFDDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
