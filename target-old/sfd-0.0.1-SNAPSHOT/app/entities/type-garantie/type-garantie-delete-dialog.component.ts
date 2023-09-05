import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TypeGarantie } from './type-garantie.model';
import { TypeGarantiePopupService } from './type-garantie-popup.service';
import { TypeGarantieService } from './type-garantie.service';

@Component({
  selector: 'jhi-type-garantie-delete-dialog',
  templateUrl: './type-garantie-delete-dialog.component.html'
})
export class TypeGarantieDeleteDialogComponent {
  typeGarantie: TypeGarantie;

  constructor(
    private typeGarantieService: TypeGarantieService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.typeGarantieService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'typeGarantieListModification',
        content: 'Deleted an typeGarantie'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.typeGarantie.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.typeGarantie.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-type-garantie-delete-popup',
  template: ''
})
export class TypeGarantieDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeGarantiePopupService: TypeGarantiePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.typeGarantiePopupService.open(
        TypeGarantieDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
