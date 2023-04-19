import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Departement } from './departement.model';
import { DepartementPopupService } from './departement-popup.service';
import { DepartementService } from './departement.service';

@Component({
  selector: 'jhi-departement-delete-dialog',
  templateUrl: './departement-delete-dialog.component.html'
})
export class DepartementDeleteDialogComponent {
  departement: Departement;

  constructor(
    private departementService: DepartementService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.departementService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'departementListModification',
        content: 'Deleted an departement'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.departement.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.departement.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-departement-delete-popup',
  template: ''
})
export class DepartementDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private departementPopupService: DepartementPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.departementPopupService.open(
        DepartementDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
