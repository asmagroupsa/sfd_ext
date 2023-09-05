import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TypesContrat } from './types-contrat.model';
import { TypesContratPopupService } from './types-contrat-popup.service';
import { TypesContratService } from './types-contrat.service';

@Component({
  selector: 'jhi-types-contrat-delete-dialog',
  templateUrl: './types-contrat-delete-dialog.component.html'
})
export class TypesContratDeleteDialogComponent {
  typesContrat: TypesContrat;

  constructor(
    private fraisService: TypesContratService,
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
        content: 'Deleted an type contrat'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.typesContrat.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.typesContrat.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-types-contrat-delete-popup',
  template: ''
})
export class TypesContratDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typesContratPopupService: TypesContratPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.typesContratPopupService.open(
        TypesContratDeleteDialogComponent as Component,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
