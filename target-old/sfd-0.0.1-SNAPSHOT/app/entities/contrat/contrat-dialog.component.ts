import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { Contrat } from './contrat.model';
import { ContratPopupService } from './contrat-popup.service';
import { ContratService } from './contrat.service';
import { SFD, SFDService } from '../s-fd';
import { Produit, ProduitService } from '../produit';
import { ResponseWrapper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-contrat-dialog',
  templateUrl: './contrat-dialog.component.html'
})
export class ContratDialogComponent implements OnInit {
  contrat: Contrat;
  authorities: any[];
  isSaving: boolean;

  sfds: SFD[];

  produits: Produit[];
  contratDateDp: any;
  clotureDateDp: any;
  createdDateDp: any;
  lastModifiedDateDp: any;
  testUnity: string = 'MOIS';
  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private contratService: ContratService,
    private sFDService: SFDService,
    private produitService: ProduitService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.sFDService.query().subscribe(
      (res: ResponseWrapper) => {
        this.sfds = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.produitService.query().subscribe(
      (res: ResponseWrapper) => {
        this.produits = res.json;
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
        if (this.contrat.id !== undefined) {
          setLastModifyBy(this.contrat, identity);
          //this.contrat.lastModifiedBy = identity.firstName || '';
          //this.contrat.lastModifiedBy += //' ' + identity.lastName || '';
          this.subscribeToSaveResponse(
            this.contratService.update(this.contrat),
            false
          );
        } else {
          setCreateBy(this.contrat, identity);
          //this.contrat.createdBy = identity.firstName || '';
          //this.contrat.createdBy += //' ' + identity.lastName || '';
          this.contrat.code = 'xxx';
          this.subscribeToSaveResponse(
            this.contratService.create(this.contrat),
            true
          );
        }
      },
      () => { }
    );
  }

  private subscribeToSaveResponse(
    result: Observable<Contrat>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Contrat) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Contrat, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.contrat.created' : 'carmesfnmserviceApp.contrat.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'contratListModification',
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

  trackSFDById(index: number, item: SFD) {
    return item.id;
  }

  trackProduitById(index: number, item: Produit) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-contrat-popup',
  template: ''
})
export class ContratPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private contratPopupService: ContratPopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.contratPopupService.open(
          ContratDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.contratPopupService.open(ContratDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
