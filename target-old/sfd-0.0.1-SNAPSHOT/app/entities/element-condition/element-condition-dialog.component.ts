import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Response } from "@angular/http";

import { Observable } from "rxjs";
import { NgbActiveModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager, JhiAlertService } from "ng-jhipster";

import { ElementCondition } from "./element-condition.model";
import { ElementConditionPopupService } from "./element-condition-popup.service";
import { ElementConditionService } from "./element-condition.service";
import { ConditionAcces, ConditionAccesService } from "../condition-acces";
import { ResponseWrapper } from "../../shared";
declare let select_init: any;
@Component({
  selector: "jhi-element-condition-dialog",
  templateUrl: "./element-condition-dialog.component.html"
})
export class ElementConditionDialogComponent implements OnInit {
  elementCondition: ElementCondition;
  isSaving: boolean;

  conditionacces: ConditionAcces[];

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private elementConditionService: ElementConditionService,
    private conditionAccesService: ConditionAccesService,
    private eventManager: JhiEventManager
  ) {}
  ngAfterViewInit() {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.conditionAccesService.query({ size: 1000 }).subscribe(
      (res: ResponseWrapper) => {
        this.conditionacces = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }

  clear() {
    this.activeModal.dismiss("cancel");
  }

  save() {
    this.isSaving = true;
    if (this.elementCondition.id !== undefined) {
      this.subscribeToSaveResponse(
        this.elementConditionService.update(this.elementCondition)
      );
    } else {
      this.subscribeToSaveResponse(
        this.elementConditionService.create(this.elementCondition)
      );
    }
  }

  private subscribeToSaveResponse(result: Observable<ElementCondition>) {
    result.subscribe(
      (res: ElementCondition) => this.onSaveSuccess(res),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: ElementCondition) {
    this.eventManager.broadcast({
      name: "elementConditionListModification",
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

  trackConditionAccesById(index: number, item: ConditionAcces) {
    return item.id;
  }
}

@Component({
  selector: "jhi-element-condition-popup",
  template: ""
})
export class ElementConditionPopupComponent implements OnInit, OnDestroy {
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private elementConditionPopupService: ElementConditionPopupService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params["id"]) {
        this.elementConditionPopupService.open(
          ElementConditionDialogComponent as Component,
          params["id"]
        );
      } else {
        this.elementConditionPopupService.open(
          ElementConditionDialogComponent as Component
        );
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
