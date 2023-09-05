import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Agence } from './agence.model';
import { AgencePopupService } from './agence-popup.service';
import { AgenceService } from './agence.service';

@Component({
  selector: 'jhi-agence-delete-dialog',
  templateUrl: './agence-delete-dialog.component.html'
})
export class AgenceDeleteDialogComponent {
  agence: Agence;

  constructor(
    private agenceService: AgenceService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.agenceService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'agenceListModification',
        content: 'Deleted an agence'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.agence.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.agence.deleted', { param: id }, null);
    });
    
  }
}

@Component({
  selector: 'jhi-agence-delete-popup',
  template: ''
})
export class AgenceDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private agencePopupService: AgencePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.agencePopupService.open(
        AgenceDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
