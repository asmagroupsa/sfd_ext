import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { TownShip } from './town-ship.model';
import { TownShipPopupService } from './town-ship-popup.service';
import { TownShipService } from './town-ship.service';
import { City, CityService } from '../city';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-town-ship-dialog',
  templateUrl: './town-ship-dialog.component.html'
})
export class TownShipDialogComponent implements OnInit {
  townShip: TownShip;
  authorities: any[];
  isSaving: boolean;

  cities: City[];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private townShipService: TownShipService,
    private cityService: CityService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.cityService.query().subscribe(
      (res: ResponseWrapper) => {
        this.cities = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.townShip.id !== undefined) {
      this.subscribeToSaveResponse(
        this.townShipService.update(this.townShip),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.townShipService.create(this.townShip),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<TownShip>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: TownShip) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: TownShip, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.townShip.created' : 'carmesfnmserviceApp.townShip.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'townShipListModification',
      content: 'OK'
    });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError(error) {
    try {
      error.json();
    } catch (exception) {
      error.message = error.text();
    }
    this.isSaving = false;
    this.onError(error);
  }

  private onError(error) {
    this.alertService.error(error.message, null, null);
  }

  trackCityById(index: number, item: City) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-town-ship-popup',
  template: ''
})
export class TownShipPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private townShipPopupService: TownShipPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.townShipPopupService.open(
          TownShipDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.townShipPopupService.open(TownShipDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
