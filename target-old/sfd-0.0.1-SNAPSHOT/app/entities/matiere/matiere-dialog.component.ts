import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Matiere } from './matiere.model';
import { MatierePopupService } from './matiere-popup.service';
import { MatiereService } from './matiere.service';
import { Formation, FormationService } from '../formation';
import { ResponseWrapper } from '../../shared';

@Component({
  selector: 'jhi-matiere-dialog',
  templateUrl: './matiere-dialog.component.html',
  styles: [
    `
      select{


       height: 50px;
       font-size:15px;
border:none;
border-bottom:1.5px solid;
      }
       `
  ]
})
export class MatiereDialogComponent implements OnInit {
  matiere: Matiere;
  authorities: any[];
  isSaving: boolean;

  formations: Formation[];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private matiereService: MatiereService,
    private formationService: FormationService,
    private eventManager: JhiEventManager
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.formationService.query().subscribe(
      (res: ResponseWrapper) => {
        this.formations = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.matiere.id !== undefined) {
      this.subscribeToSaveResponse(
        this.matiereService.update(this.matiere),
        false
      );
    } else {
      this.subscribeToSaveResponse(
        this.matiereService.create(this.matiere),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Matiere>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Matiere) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Matiere, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.matiere.created' : 'carmesfnmserviceApp.matiere.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'matiereListModification',
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

  trackFormationById(index: number, item: Formation) {
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
  selector: 'jhi-matiere-popup',
  template: ''
})
export class MatierePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private matierePopupService: MatierePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.matierePopupService.open(
          MatiereDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.matierePopupService.open(MatiereDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
