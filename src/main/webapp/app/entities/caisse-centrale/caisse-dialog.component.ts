import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Caisse } from './caisse.model';
import { CaissePopupService } from './caisse-popup.service';
import { CaisseCentraleService } from './caisse.service';
import { TypeCaisse, TypeCaisseService } from '../type-caisse';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-caisse-dialog',
  templateUrl: './caisse-dialog.component.html'
})
export class CaisseDialogComponent implements OnInit {
  caisse: Caisse;
  isSaving: boolean;

  typecaisses: TypeCaisse[];
  dateOuvertureDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private caisseService: CaisseCentraleService,
    private typeCaisseCentraleService: TypeCaisseService,
    private eventManager: JhiEventManager
  ) { }
  ngAfterContentInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.typeCaisseCentraleService.query().subscribe(
      (res: ResponseWrapper) => {
        this.typecaisses = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.caisse.id !== undefined) {
      this.subscribeToSaveResponse(this.caisseService.update(this.caisse));
    } else {
      this.subscribeToSaveResponse(this.caisseService.create(this.caisse));
    }
  }

  private subscribeToSaveResponse(result: Observable<Caisse>) {
    result.subscribe(
      (res: Caisse) => this.onSaveSuccess(res),
      (res: Response) => this.onSaveError()
    );
  }

  private onSaveSuccess(result: Caisse) {
    this.eventManager.broadcast({
      name: 'caisseListModification',
      content: 'OK'
    });
    this.isSaving = false;
    this.activeModal.dismiss(result);
  }

  private onSaveError() {
    this.isSaving = false;
  }

  private onError(error: any) {
    this.alertService.error(error.message, null, null);
  }

  trackTypeCaisseById(index: number, item: TypeCaisse) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-caisse-popup',
  template: ''
})
export class CaissePopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private caissePopupService: CaissePopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.caissePopupService.open(
          CaisseDialogComponent as Component,
          params['id']
        );
      } else {
        this.caissePopupService.open(CaisseDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
