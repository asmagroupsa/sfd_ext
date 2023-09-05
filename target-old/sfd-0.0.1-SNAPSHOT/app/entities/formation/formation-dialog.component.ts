import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { Formation } from './formation.model';
import { FormationPopupService } from './formation-popup.service';
import { FormationService } from './formation.service';
import { Matiere, MatiereService } from '../matiere';
import { Principal, UserData } from '../../shared';
import {
  NotificationClient,
  NotificationClientService
} from '../notification-client';
import { ResponseWrapper } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-formation-dialog',
  templateUrl: './formation-dialog.component.html'
})
export class FormationDialogComponent implements OnInit {
  agences: any[];
  formation: Formation;
  authorities: any[];
  isSaving: boolean;

  matieres: Matiere[];

  notificationclients: NotificationClient[];
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private formationService: FormationService,
    private matiereService: MatiereService,
    private notificationClientService: NotificationClientService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.agences = UserData.getInstance().listeAgences;

    if (this.agences.length === 1) {
      this.formation.agenceReference = this.agences[0].codeAgence;
    }


    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.matiereService.query().subscribe(
      (res: ResponseWrapper) => {
        this.matieres = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.notificationClientService.query().subscribe(
      (res: ResponseWrapper) => {
        this.notificationclients = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    this.principal.identity().then(
      (identity: any) => {
        if (this.formation.id !== undefined) {
          setLastModifyBy(this.formation, identity);
          this.subscribeToSaveResponse(
            this.formationService.update(this.formation),
            false
          );
        } else {
          setCreateBy(this.formation, identity);
          this.subscribeToSaveResponse(
            this.formationService.create(this.formation),
            true
          );
        }
      },
      () => { }
    );
  }

  private subscribeToSaveResponse(result: Observable<Formation>, isCreated: boolean) {
    result.subscribe(
      (res: Formation) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Formation, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.formation.created' : 'carmesfnmserviceApp.formation.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'formationListModification',
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

  trackMatiereById(index: number, item: Matiere) {
    return item.id;
  }

  trackNotificationClientById(index: number, item: NotificationClient) {
    return item.id;
  }

  getSelected(selectedVals: Array<any>, option: any) {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}

@Component({
  selector: 'jhi-formation-popup',
  template: ''
})
export class FormationPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private formationPopupService: FormationPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.formationPopupService.open(
          FormationDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.formationPopupService.open(
          FormationDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
