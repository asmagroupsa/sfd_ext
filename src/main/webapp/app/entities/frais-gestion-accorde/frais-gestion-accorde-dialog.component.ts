import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { FraisGestionAccorde } from './frais-gestion-accorde.model';
import { FraisGestionAccordePopupService } from './frais-gestion-accorde-popup.service';
import { FraisGestionAccordeService } from './frais-gestion-accorde.service';
import { LigneCredit, LigneCreditService } from '../ligne-credit';
import { FraisGestion, FraisGestionService } from '../frais-gestion';
import { ResponseWrapper, UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-frais-gestion-accorde-dialog',
  templateUrl: './frais-gestion-accorde-dialog.component.html'
})
export class FraisGestionAccordeDialogComponent implements OnInit {
  fraisGestionAccorde: FraisGestionAccorde;
  authorities: any[];
  isSaving: boolean;

  lignecredits: LigneCredit[];

  fraisgestions: FraisGestion[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private fraisGestionAccordeService: FraisGestionAccordeService,
    private ligneCreditService: LigneCreditService,
    private fraisGestionService: FraisGestionService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.ligneCreditService
      .query({ filter: 'fraisgestionaccorde-is-null' })
      .subscribe(
        (res: ResponseWrapper) => {
          if (!this.fraisGestionAccorde.ligneCreditId) {
            this.lignecredits = res.json;
          } else {
            this.ligneCreditService
              .find(this.fraisGestionAccorde.ligneCreditId)
              .subscribe(
                (subRes: LigneCredit) => {
                  this.lignecredits = [subRes].concat(res.json);
                },
                (subRes: ResponseWrapper) => this.onError(subRes.json)
              );
          }
        },
        (res: ResponseWrapper) => this.onError(res.json)
      );
    this.fraisGestionService.query().subscribe(
      (res: ResponseWrapper) => {
        this.fraisgestions = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.fraisGestionAccorde.id !== undefined) {
      this.subscribeToSaveResponse(
        this.fraisGestionAccordeService.update(this.fraisGestionAccorde),
        false
      );
    } else {
      this.fraisGestionAccorde.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.fraisGestionAccordeService.create(this.fraisGestionAccorde),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<FraisGestionAccorde>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: FraisGestionAccorde) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: FraisGestionAccorde, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.fraisGestionAccorde.created'
        : 'carmesfnmserviceApp.fraisGestionAccorde.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'fraisGestionAccordeListModification',
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

  trackLigneCreditById(index: number, item: LigneCredit) {
    return item.id;
  }

  trackFraisGestionById(index: number, item: FraisGestion) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-frais-gestion-accorde-popup',
  template: ''
})
export class FraisGestionAccordePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private fraisGestionAccordePopupService: FraisGestionAccordePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.fraisGestionAccordePopupService.open(
          FraisGestionAccordeDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.fraisGestionAccordePopupService.open(
          FraisGestionAccordeDialogComponent
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
