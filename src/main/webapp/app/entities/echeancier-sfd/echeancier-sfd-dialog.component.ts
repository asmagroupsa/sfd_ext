import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { EcheancierSFD } from './echeancier-sfd.model';
import { EcheancierSFDPopupService } from './echeancier-sfd-popup.service';
import { EcheancierSFDService } from './echeancier-sfd.service';
import { LigneCredit, LigneCreditService } from '../ligne-credit';
import { ResponseWrapper, Principal } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-echeancier-sfd-dialog',
  templateUrl: './echeancier-sfd-dialog.component.html'
})
export class EcheancierSFDDialogComponent implements OnInit {
  params: { [key: string]: any };
  echeancierSFD: EcheancierSFD;
  authorities: any[];
  isSaving: boolean;

  lignecredits: LigneCredit[];
  startDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private echeancierSFDService: EcheancierSFDService,
    private ligneCreditService: LigneCreditService,
    private eventManager: JhiEventManager,
    public principal: Principal,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });
  }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.ligneCreditService
      .query({ filter: 'echeanciersfd-is-null' })
      .subscribe(
        (res: ResponseWrapper) => {
          if (!this.echeancierSFD.ligneCreditId) {
            this.lignecredits = res.json;
          } else {
            this.ligneCreditService
              .find(this.echeancierSFD.ligneCreditId)
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
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (!this.params || !this.params.ligne) {
      this.alertService.error("la ligne n'est pas séléctionnée", null, null);
      this.activeModal.dismiss(true);
      return;
    }
    this.principal.identity().then(
      (identity: any) => {
        if (this.echeancierSFD.id !== undefined) {
          setLastModifyBy(this.echeancierSFD, identity);
          //this.echeancierSFD.lastModifiedBy = identity.firstName || "";
          //this.echeancierSFD.lastModifiedBy += " " + identity.lastName || "";
          this.subscribeToSaveResponse(
            this.echeancierSFDService.update(this.echeancierSFD),
            false
          );
        } else {
          this.echeancierSFD.ligneCreditId = +this.params.ligne;
          setCreateBy(this.echeancierSFD, identity);
          //this.echeancierSFD.createdBy = identity.firstName || "";
          //this.echeancierSFD.createdBy += " " + identity.lastName || "";
          this.subscribeToSaveResponse(
            this.echeancierSFDService.create(this.echeancierSFD),
            true
          );
        }
      },
      () => {}
    );
  }

  private subscribeToSaveResponse(
    result: Observable<EcheancierSFD>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: EcheancierSFD) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: EcheancierSFD, isCreated: boolean) {
    this.alertService.success(
      isCreated
        ? 'carmesfnmserviceApp.echeancierSFD.created'
        : 'carmesfnmserviceApp.echeancierSFD.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'echeancierSFDListModification',
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
}

@Component({
  selector: 'jhi-echeancier-sfd-popup',
  template: ''
})
export class EcheancierSFDPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private echeancierSFDPopupService: EcheancierSFDPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.echeancierSFDPopupService.open(
          EcheancierSFDDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.echeancierSFDPopupService.open(
          EcheancierSFDDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
