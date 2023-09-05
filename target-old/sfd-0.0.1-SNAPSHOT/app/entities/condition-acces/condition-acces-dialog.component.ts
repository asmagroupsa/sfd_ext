import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Response } from "@angular/http";

import { Observable } from "rxjs";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager, JhiAlertService } from "ng-jhipster";

import { ConditionAcces } from "./condition-acces.model";
import { ConditionAccesPopupService } from "./condition-acces-popup.service";
import { ConditionAccesService } from "./condition-acces.service";
import { Produit, ProduitService } from "../produit";
import { ResponseWrapper } from "../../shared";
import {
  CategorieCondition,
  CategorieConditionService
} from "../categorie-condition";
declare let select_init: any;
@Component({
  selector: "jhi-condition-acces-dialog",
  templateUrl: "./condition-acces-dialog.component.html"
})
export class ConditionAccesDialogComponent implements OnInit {
  categorieconditions: any;
  conditionAcces: ConditionAcces;
  isSaving: boolean;

  produits: Produit[];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private conditionAccesService: ConditionAccesService,
    private produitService: ProduitService,
    private categorieConditionService: CategorieConditionService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.categorieConditionService.query({ size: 1000 }).subscribe(
      (res: ResponseWrapper) => {
        this.categorieconditions = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.produitService.query({ size: 1000 }).subscribe(
      (res: ResponseWrapper) => {
        this.produits = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss("cancel");
  }

  save() {
    this.isSaving = true;
    if (this.conditionAcces.id !== undefined) {
      this.subscribeToSaveResponse(
        this.conditionAccesService.update(this.conditionAcces)
      );
    } else {
      this.subscribeToSaveResponse(
        this.conditionAccesService.create(this.conditionAcces)
      );
    }
  }

  private subscribeToSaveResponse(result: Observable<ConditionAcces>) {
    result.subscribe(
      (res: ConditionAcces) => this.onSaveSuccess(res),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: ConditionAcces) {
    this.eventManager.broadcast({
      name: "conditionAccesListModification",
      content: "OK"
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
  selector: "jhi-condition-acces-popup",
  template: ""
})
export class ConditionAccesPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private conditionAccesPopupService: ConditionAccesPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params["id"]) {
        this.conditionAccesPopupService.open(
          ConditionAccesDialogComponent as Component,
          params["id"]
        );
      } else {
        this.conditionAccesPopupService.open(
          ConditionAccesDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
