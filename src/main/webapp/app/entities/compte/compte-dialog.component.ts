import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { setCreateBy, setLastModifyBy } from '../../shared/model/functions';
import { Compte } from './compte.model';
import { ComptePopupService } from './compte-popup.service';
import { CompteService } from './compte.service';
import { AccountType, AccountTypeService } from '../account-type';
import { Client, ClientService } from '../client';
import { ResponseWrapper, UserData } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
declare let select_init: any;
@Component({
  selector: 'jhi-compte-dialog',
  templateUrl: './compte-dialog.component.html'
})
export class CompteDialogComponent implements OnInit {
  clientOK: boolean;
  compte: Compte;
  authorities: any[];
  isSaving: boolean;

  accounttypes: AccountType[];

  clients: Client[];
  createdDateDp: any;
  lastModifiedDateDp: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    private compteService: CompteService,
    private accountTypeService: AccountTypeService,
    private clientService: ClientService,
    private eventManager: JhiEventManager,
    public principal: Principal
  ) { }
  ngAfterViewInit() {
    select_init();
  }
  nom(id: any) {
    if (!this.clients) return '';
    let client = this.clients.find(value => {
      return value.id == id;
    });
    return client
      ? (client.name ? client.name : '') +
      ' ' +
      (client.firstName ? client.firstName : '')
      : '';
  }
  ngOnInit() {
    this.isSaving = false;
    this.clientOK = this.compte.clientId ? true : false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.accountTypeService.query({ size: 1000 }).subscribe(
      (res: ResponseWrapper) => {
        this.accounttypes = res.json;
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
    this.clientService.query({ size: 1000 }).subscribe(
      (res: ResponseWrapper) => {
        this.clients = res.json;
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
        if (this.compte.id !== undefined) {
          setLastModifyBy(this.compte, identity);
          //this.compte.lastModifiedBy = identity.firstName || "";
          //this.compte.lastModifiedBy += " " + identity.lastName || "";
          this.subscribeToSaveResponse(this.compteService.update(this.compte), false);
        } else {
          setCreateBy(this.compte, identity);
          //this.compte.createdBy = identity.firstName || "";
          //this.compte.createdBy += " " + identity.lastName || "";
          this.subscribeToSaveResponse(this.compteService.create(this.compte), true);
        }
      },
      () => { }
    );
  }

  private subscribeToSaveResponse(
    result: Observable<Compte>,
    isCreated: boolean
  ) {
    result.subscribe(
      (res: Compte) => this.onSaveSuccess(res, isCreated),
      (res: Response) => this.onSaveError(res)
    );
  }

  private onSaveSuccess(result: Compte, isCreated: boolean) {
    this.alertService.success(
      isCreated ? 'carmesfnmserviceApp.compte.created' : 'carmesfnmserviceApp.compte.updated',
      { param: result.id },
      null
    );

    this.eventManager.broadcast({
      name: 'compteListModification',
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

  trackAccountTypeById(index: number, item: AccountType) {
    return item.id;
  }

  trackClientById(index: number, item: Client) {
    return item.id;
  }
}

@Component({
  selector: 'jhi-compte-popup',
  template: ''
})
export class ComptePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private comptePopupService: ComptePopupService
  ) { }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.modalRef = this.comptePopupService.open(
          CompteDialogComponent as Component,
          params['id']
        );
      } else {
        this.modalRef = this.comptePopupService.open(CompteDialogComponent as Component);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
