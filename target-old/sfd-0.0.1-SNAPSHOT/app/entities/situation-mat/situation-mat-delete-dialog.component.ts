import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { SituationMat } from './situation-mat.model';
import { SituationMatPopupService } from './situation-mat-popup.service';
import { SituationMatService } from './situation-mat.service';

@Component({
  selector: 'jhi-situation-mat-delete-dialog',
  templateUrl: './situation-mat-delete-dialog.component.html'
})
export class SituationMatDeleteDialogComponent {
  situationMat: SituationMat;

  constructor(
    private situationMatService: SituationMatService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.situationMatService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'situationMatListModification',
        content: 'Deleted an situationMat'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.situationMat.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.situationMat.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-situation-mat-delete-popup',
  template: ''
})
export class SituationMatDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private situationMatPopupService: SituationMatPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.situationMatPopupService.open(
        SituationMatDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
