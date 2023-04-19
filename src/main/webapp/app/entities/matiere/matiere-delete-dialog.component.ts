import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Matiere } from './matiere.model';
import { MatierePopupService } from './matiere-popup.service';
import { MatiereService } from './matiere.service';

@Component({
  selector: 'jhi-matiere-delete-dialog',
  templateUrl: './matiere-delete-dialog.component.html'
})
export class MatiereDeleteDialogComponent {
  matiere: Matiere;

  constructor(
    private matiereService: MatiereService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.matiereService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'matiereListModification',
        content: 'Deleted an matiere'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.matiere.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.matiere.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-matiere-delete-popup',
  template: ''
})
export class MatiereDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private matierePopupService: MatierePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.matierePopupService.open(
        MatiereDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
