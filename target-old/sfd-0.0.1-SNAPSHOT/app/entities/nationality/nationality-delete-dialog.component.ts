import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { Nationality } from './nationality.model';
import { NationalityPopupService } from './nationality-popup.service';
import { NationalityService } from './nationality.service';

@Component({
  selector: 'jhi-nationality-delete-dialog',
  templateUrl: './nationality-delete-dialog.component.html'
})
export class NationalityDeleteDialogComponent {
  nationality: Nationality;

  constructor(
    private nationalityService: NationalityService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.nationalityService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'nationalityListModification',
        content: 'Deleted an nationality'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.nationality.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.nationality.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-nationality-delete-popup',
  template: ''
})
export class NationalityDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private nationalityPopupService: NationalityPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.nationalityPopupService.open(
        NationalityDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
