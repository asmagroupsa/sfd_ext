import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TypeMembre } from './type-membre.model';
import { TypeMembrePopupService } from './type-membre-popup.service';
import { TypeMembreService } from './type-membre.service';

@Component({
  selector: 'jhi-type-membre-delete-dialog',
  templateUrl: './type-membre-delete-dialog.component.html'
})
export class TypeMembreDeleteDialogComponent {
  typeMembre: TypeMembre;

  constructor(
    private typeMembreService: TypeMembreService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.typeMembreService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'typeMembreListModification',
        content: 'Deleted an typeMembre'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.typeMembre.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.typeMembre.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-type-membre-delete-popup',
  template: ''
})
export class TypeMembreDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private typeMembrePopupService: TypeMembrePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.typeMembrePopupService.open(
        TypeMembreDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
