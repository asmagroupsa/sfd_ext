import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { TownShip } from './town-ship.model';
import { TownShipPopupService } from './town-ship-popup.service';
import { TownShipService } from './town-ship.service';

@Component({
  selector: 'jhi-town-ship-delete-dialog',
  templateUrl: './town-ship-delete-dialog.component.html'
})
export class TownShipDeleteDialogComponent {
  townShip: TownShip;

  constructor(
    private townShipService: TownShipService,
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.townShipService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'townShipListModification',
        content: 'Deleted an townShip'
      });
      this.activeModal.dismiss(true);
      this.alertService.success('sfdApp.carmesfnmserviceApp.townShip.deleted', { param: id }, null);
    }, (e) => {
      this.alertService.error('sfdApp.carmesfnmserviceApp.townShip.deleted', { param: id }, null);
    });
  }
}

@Component({
  selector: 'jhi-town-ship-delete-popup',
  template: ''
})
export class TownShipDeletePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private townShipPopupService: TownShipPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.modalRef = this.townShipPopupService.open(
        TownShipDeleteDialogComponent,
        params['id']
      );
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
