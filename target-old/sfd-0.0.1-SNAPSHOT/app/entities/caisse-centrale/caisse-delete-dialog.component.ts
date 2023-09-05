import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Caisse } from './caisse.model';
import { CaissePopupService } from './caisse-popup.service';
import { CaisseCentraleService } from './caisse.service';

@Component({
  selector: 'jhi-caisse-delete-dialog',
  templateUrl: './caisse-delete-dialog.component.html'
})
export class CaisseDeleteDialogComponent {
  caisse: Caisse;

  constructor(
    private caisseService: CaisseCentraleService,
    public activeModal: NgbActiveModal,
    private eventManager: JhiEventManager,
    private alertService: JhiAlertService
  ) { }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.caisseService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'caisseListModification',
        content: 'Deleted an caisse'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.caisse.deleted', { param: id }, null)
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.caisse.deleted', { param: id }, null)
    });
  }
}

@Component({
  selector: 'jhi-caisse-delete-popup',
  template: ''
})
export class CaisseDeletePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private caissePopupService: CaissePopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.caissePopupService.open(
        CaisseDeleteDialogComponent as Component,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
