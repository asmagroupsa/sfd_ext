import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { HistoriqueUtilisateurCaissePopupService } from './historique-caisse-popup.service';
import { CaisseNouvelleService } from '../caisse-nouvelle.service';
import { LanguesService } from '../../../shared/myTranslation/langues';
import { ResponseWrapper } from '../../../shared';
import { DatePipe } from '@angular/common';
declare let select_init: any;
@Component({
  selector: 'jhi-historique-caisse-dialog',
  templateUrl: './historique-caisse-dialog.component.html'
})
export class HistoriqueUtilisateurCaisseDialogComponent implements OnInit {
  historiques:any[]= [];
  authorities: any[];
  isSaving: boolean;
  agences = [];
  nameCaisse:string;
  agence:string;
  caisse:string;
  date1: any;
  date2: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: JhiAlertService,
    public langue: LanguesService,
    activatedRoute: ActivatedRoute,
    private caisseNouvelleService: CaisseNouvelleService,
    private _datePipe: DatePipe
  ) {
    this.nameCaisse = activatedRoute.snapshot.queryParams['nameCaisse'];
    this.agence = activatedRoute.snapshot.queryParams['agence'];
    this.caisse = activatedRoute.snapshot.queryParams['caisse'];
    let now = new Date();
      this.date2 = {year:now.getFullYear(),month:now.getMonth() +1, day:now.getDate()};
      now.setMonth(now.getMonth() - 1);
      this.date1 = {year:now.getFullYear(),month:now.getMonth() +1, day:now.getDate()};
   }
  ngAfterViewInit() {
    select_init();
  }
  ngOnInit() {
    this.isSaving = false;
    this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    this.loadAll();
  }

  loadAll(){
    const formatDate = (date)=>{
      if(!date) return null;
      return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'y-MM-dd');
  }
    this.caisseNouvelleService.getHistorique({
      'caisse':this.caisse,
      agence_reference: this.agence,
date1:formatDate(this.date1),
date2: formatDate(this.date2)
    }).subscribe(
      (res: ResponseWrapper) => {
        console.log(res),
        this.historiques = res.json
      },
      (res: ResponseWrapper) => this.onError(res.json)
    );
  }
  
  onPeriodChange(){
    this.loadAll();
  }

  clear() {
    this.activeModal.dismiss('cancel');
  }




  private onError(error:any) {
    this.alertService.error(error.message, null, null);
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
  selector: 'jhi-history-utilisateur-caisse-popup',
  template: ''
})
export class HistoriqueUtilisateurCaissePopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private utilisateurCaissePopupService: HistoriqueUtilisateurCaissePopupService
  ) { }

  ngOnInit() {
    // if (LOCAL_FLAG) {
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id']) {
          this.modalRef = this.utilisateurCaissePopupService.open(
            HistoriqueUtilisateurCaisseDialogComponent as Component,
            params['id']
          );
        } else {
          this.modalRef = this.utilisateurCaissePopupService.open(
            HistoriqueUtilisateurCaisseDialogComponent as Component
          );
        }
      });
    // } else {
    //   window.history.back();
    // }
  }

  ngOnDestroy() {
    if (this.routeSub)
      this.routeSub.unsubscribe();
  }
}
