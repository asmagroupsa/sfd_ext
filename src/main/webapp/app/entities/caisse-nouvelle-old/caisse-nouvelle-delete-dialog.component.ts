import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { CaisseNouvellePopupService } from './caisse-nouvelle-popup.service';
import { CaisseNouvelle } from './caisse-nouvelle.model';
import { CaisseNouvelleService } from './caisse-nouvelle.service';

@Component({
  selector: 'jhi-caisse-nouvelle-delete-dialog',
  templateUrl: './caisse-nouvelle-delete-dialog.component.html'
})
export class CaisseNouvelleDeleteDialogComponent {
  caisseNouvelle: CaisseNouvelle;

  constructor(
    private caisseNouvelleService: CaisseNouvelleService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.caisseNouvelleService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'caisseNouvelleListModification',
        content: 'Deleted an caisseNouvelle'
      });
      this.activeModal.dismiss(true);
      this.alertService.success(
        'carmesfnmserviceApp.caisseNouvelle.deleted',
        { param: id },
        null
      );
    }, (e) => {
      this.alertService.success(
        'carmesfnmserviceApp.caisseNouvelle.deleted',
        { param: id },
        null
      );
    });
  }
}

@Component({
  selector: 'jhi-caisse-nouvelle-delete-popup',
  template: ''
})
export class CaisseNouvelleDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private caisseNouvellePopupService: CaisseNouvellePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.caisseNouvellePopupService.open(
        CaisseNouvelleDeleteDialogComponent as Component,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
