import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService } from 'ng-jhipster';
import { ListeCaissierPopupService } from './liste-caissier-popup.service';
import { CaisseNouvelleService } from '../caisse-nouvelle.service';
import { LanguesService } from '../../../shared/myTranslation/langues';
import { ResponseWrapper } from '../../../shared';
import { DatePipe } from '@angular/common';
declare let select_init: any;
@Component({
  selector: 'jhi-liste-caissier-dialog',
  templateUrl: './liste-caissier-dialog.component.html'
})
export class ListeCaissierDialogComponent implements OnInit {
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
    this.caisseNouvelleService.queryListeCaissierAgence({},this.agence).subscribe(
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
  selector: 'jhi-liste-caissier-popup',
  template: ''
})
export class ListeCaissierPopupComponent implements OnInit, OnDestroy {
  modalRef: NgbModalRef;
  routeSub: any;

  constructor(
    private route: ActivatedRoute,
    private listeCaissierPopupService: ListeCaissierPopupService
  ) { }

  ngOnInit() {
    // if (LOCAL_FLAG) {
      this.routeSub = this.route.params.subscribe(params => {
        if (params['id']) {
          this.modalRef = this.listeCaissierPopupService.open(
            ListeCaissierDialogComponent as Component,
            params['id']
          );
        } else {
          this.modalRef = this.listeCaissierPopupService.open(
            ListeCaissierDialogComponent as Component
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
