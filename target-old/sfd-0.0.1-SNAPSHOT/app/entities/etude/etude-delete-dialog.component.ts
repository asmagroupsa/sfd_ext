import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Etude } from './etude.model';
import { EtudePopupService } from './etude-popup.service';
import { EtudeService } from './etude.service';

@Component({
  selector: 'jhi-etude-delete-dialog',
  templateUrl: './etude-delete-dialog.component.html'
})
export class EtudeDeleteDialogComponent {
  etude: Etude;

  constructor(
    private etudeService: EtudeService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.etudeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'etudeListModification',
        content: 'Deleted an etude'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.etude.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.etude.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-etude-delete-popup',
  template: ''
})
export class EtudeDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private etudePopupService: EtudePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.etudePopupService.open(
        EtudeDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
