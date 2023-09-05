import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Annee } from './cautions.model';
import { AnneePopupService } from './cautions-popup.service';
import { AnneeService } from './cautions.service';

@Component({
  selector: 'jhi-cautions-delete-dialog',
  templateUrl: './cautions-delete-dialog.component.html'
})
export class AnneeDeleteDialogComponent {
  annee: Annee;

  constructor(
    private anneeService: AnneeService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.anneeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'anneeListModification',
        content: 'Deleted an annee'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.annee.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.annee.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-annee-delete-popup',
  template: ''
})
export class AnneeDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private anneePopupService: AnneePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.anneePopupService.open(
        AnneeDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
