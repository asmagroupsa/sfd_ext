import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Contrat } from './contrat.model';
import { ContratPopupService } from './contrat-popup.service';
import { ContratService } from './contrat.service';

@Component({
  selector: 'jhi-contrat-delete-dialog',
  templateUrl: './contrat-delete-dialog.component.html'
})
export class ContratDeleteDialogComponent {
  contrat: Contrat;

  constructor(
    private contratService: ContratService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.contratService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'contratListModification',
        content: 'Deleted an contrat'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.contrat.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.contrat.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-contrat-delete-popup',
  template: ''
})
export class ContratDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private contratPopupService: ContratPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.contratPopupService.open(
        ContratDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
