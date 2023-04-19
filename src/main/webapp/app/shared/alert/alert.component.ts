import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiAlertService } from 'ng-jhipster';

@Component({
    selector: 'jhi-alert',
    template: `
   <div class="alerts" role="alert">
             <div *ngFor="let alert of alerts" [ngClass]="{\'alert.position\': true, \'toast\': alert.toast}">
                <div id="toasty" class="toasty-position-top-right" *ngIf="alert && alert.type && alert.msg">
                  <div class="toast toasty-type-success toasty-theme-default" *ngIf="alert.type == 'success'">
                    <div class="close-button"></div>
                    <div class="toast-text">
                      <span class="toast-title">Succès</span>
                      <br>
                      <span class="toast-msg" [jhiFnmTranslate]="alert.msg || 'L opération a été effectué avec succès'" [translateValues]="alert.params?alert.params['param']:''">
                        {{alert.msg || "L'opération a été effectué avec succès"}}
                      </span>
                    </div>
                  </div>
                  <div class="toast toasty-type-warning toasty-theme-default" *ngIf="alert.type == 'warning'">
                    <div class="close-button"></div>
                    <div class="toast-text">
                      <span class="toast-title">Avertissement</span>
                      <br>
                      <span class="toast-msg" [jhiFnmTranslate]="alert.msg" [translateValues]="alert.params?alert.params['param']:''">
                        {{alert.msg}}
                      </span>
                    </div>
                  </div>
                  <div class="toast toasty-type-error toasty-theme-default" *ngIf="alert.type == 'danger'">
                    <div class="close-button"></div>
                    <div class="toast-text">
                      <span class="toast-title">Erreur</span>
                      <br>
                      <span class="toast-msg" [jhiFnmTranslate]="alert.msg || 'Une erreur s est produite!!! Veuillez réessayer!'" [translateValues]="alert.params?alert.params['param']:''">
                        {{alert.msg || "Une erreur s'est produite!!! Veuillez réessayer!"}}
                      </span>
                    </div>
                  </div>
                </div>
            </div>
        </div> 
  `
})
export class JhiAlertComponent implements OnInit, OnDestroy {
    alerts: any[];

    constructor(private alertService: JhiAlertService) {}

    ngOnInit() {
        this.alerts = this.alertService.get();
    }

    ngOnDestroy() {
        this.alerts = [];
    }
}
