import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Garantie } from './garantie.model';
import { GarantiePopupService } from './garantie-popup.service';
import { GarantieService } from './garantie.service';

@Component({
  selector: 'jhi-garantie-delete-dialog',
  templateUrl: './garantie-delete-dialog.component.html'
})
export class GarantieDeleteDialogComponent {
  garantie: Garantie;

  constructor(
    private garantieService: GarantieService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.garantieService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'garantieListModification',
        content: 'Deleted an garantie'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.garantie.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.garantie.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-garantie-delete-popup',
  template: ''
})
export class GarantieDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private garantiePopupService: GarantiePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.garantiePopupService.open(
        GarantieDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
