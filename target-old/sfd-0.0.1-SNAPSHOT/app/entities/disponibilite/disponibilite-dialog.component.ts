import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Disponibilite } from './disponibilite.model';
import { DisponibilitePopupService } from './disponibilite-popup.service';
import { DisponibiliteService } from './disponibilite.service';
import { CreditComity, CreditComityService } from '../credit-comity';
import { ResponseWrapper, UserData } from '../../shared';
import { Agence } from '../agence';
declare let select_init: any;

@Component({
  selector: 'jhi-disponibilite-dialog',
  templateUrl: './disponibilite-dialog.component.html'
})
export class DisponibiliteDialogComponent implements OnInit {
  agences: Agence[] = [];
  disponibilites: any[] = [];
  currentComity: CreditComity;
  params: { [key: string]: any };
  disponibilite: Disponibilite;
  authorities: any[];
  isSaving: boolean;

  creditcomities: CreditComity[];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private disponibiliteService: DisponibiliteService,
    private creditComityService: CreditComityService,
    private eventManager: JhiEventManager,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }
  ngAfterViewInit() {
    select_init();
  }
  getDisponibilite() {
    this.disponibiliteService
      .queryDisponibles(this.params['comite'])
      .subscribe((res: ResponseWrapper) => {
        this.disponibilites = [];
        res.json.forEach(dispo => {
          if (dispo.presence) this.disponibilites.push(dispo.jhi_user);
        });
      });
  }
  ngOnInit() {
    /* this.agences = UserData.getInstance().listeAgences || [];

    if (this.agences.length == 1) {
      this.disponibilite.agenceReference = this.agences[0].codeAgence;
    } */

    this.isSaving = false;
    this.disponibilite.creditComityId = +this.params['comite'];
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.getDisponibilite();
    this.creditComityService.find(this.disponibilite.creditComityId).subscribe(
      (res: CreditComity) => {
        this.currentComity = res;
        this.agences = res.agences || [];
    if (this.agences.length == 1) {
      this.disponibilite.agenceReference = this.agences[0].codeAgence;
    }
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.disponibilite.id !== undefined) {
      this.subscribeToSaveResponse(
        this.disponibiliteService.update(this.disponibilite),
        false
      );
    } else {
      this.disponibilite.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.disponibiliteService.create(this.disponibilite),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Disponibilite>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Disponibilite) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Disponibilite, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.disponibilite.created'
        : 'carmesfnmserviceApp.disponibilite.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'disponibiliteListModification',
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

  trackCreditComityById(index: number, item: CreditComity) {
    return item.id;
  }
  onComityChange() { }
}

@Component({
  selector: 'jhi-disponibilite-popup',
  template: ''
})
export class DisponibilitePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private disponibilitePopupService: DisponibilitePopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.disponibilitePopupService.open(
          DisponibiliteDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.disponibilitePopupService.open(
          DisponibiliteDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
