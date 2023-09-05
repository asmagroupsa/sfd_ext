import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Formation } from './formation.model';
import { FormationPopupService } from './formation-popup.service';
import { FormationService } from './formation.service';

@Component({
  selector: 'jhi-formation-delete-dialog',
  templateUrl: './formation-delete-dialog.component.html'
})
export class FormationDeleteDialogComponent {
  formation: Formation;

  constructor(
    private formationService: FormationService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.formationService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'formationListModification',
        content: 'Deleted an formation'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.formation.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.formation.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-formation-delete-popup',
  template: ''
})
export class FormationDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private formationPopupService: FormationPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.formationPopupService.open(
        FormationDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
