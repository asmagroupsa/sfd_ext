import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Eligible } from './eligible.model';
import { EligiblePopupService } from './eligible-popup.service';
import { EligibleService } from './eligible.service';
import { Produit, ProduitService } from '../produit';
import { SFD, SFDService } from '../s-fd';
import { Departement, DepartementService } from '../departement';
import { ResponseWrapper, UserData } from '../../shared';
declare let select_init: any;
@Component({
  selector: 'jhi-eligible-dialog',
  templateUrl: './eligible-dialog.component.html'
})
export class EligibleDialogComponent implements OnInit {
  eligible: Eligible;
  authorities: any[];
  isSaving: boolean;

  produits: Produit[];

  sfds: SFD[];

  departements: Departement[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private eligibleService: EligibleService,
    private produitService: ProduitService,
    private sFDService: SFDService,
    private departementService: DepartementService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.produitService.query().subscribe(
      (res: ResponseWrapper) => {
        this.produits = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.sFDService.query().subscribe(
      (res: ResponseWrapper) => {
        this.sfds = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.departementService.query().subscribe(
      (res: ResponseWrapper) => {
        this.departements = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }

  save() {
    this.isSaving = true;
    if (this.eligible.id !== undefined) {
      this.subscribeToSaveResponse(
        this.eligibleService.update(this.eligible),
        false
      );
    } else {
      this.eligible.sfdReference = UserData.getInstance().currentSfdReference;
      this.subscribeToSaveResponse(
        this.eligibleService.create(this.eligible),
        true
      );
    }
  }

  private subscribeToSaveResponse(
    result: Observable<Eligible>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Eligible) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Eligible, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.eligible.created' : 'carmesfnmserviceApp.eligible.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'eligibleListModification',
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

  trackProduitById(index: number, item: Produit) {
    return item.id;
  }

  trackSFDById(index: number, item: SFD) {
    return item.id;
  }

  trackDepartementById(index: number, item: Departement) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-eligible-popup',
  template: ''
})
export class EligiblePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private eligiblePopupService: EligiblePopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.eligiblePopupService.open(
          EligibleDialogComponent,
          params['id']
        );
      } else {
        this.modalRef = this.eligiblePopupService.open(EligibleDialogComponent);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
