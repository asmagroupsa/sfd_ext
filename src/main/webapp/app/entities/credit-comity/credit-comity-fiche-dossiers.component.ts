import { Component, OnInit, OnDestroy,ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


import { READFILEURL } from '../../shared/model/request-util';
import { UserData } from '../../shared'
import { CreditComity } from './credit-comity.model';
import { CreditComityPopupService } from './credit-comity-popup.service';
import { CreditComityService } from './credit-comity.service';
import { LanguesService } from "../../shared/myTranslation/langues";
import { StateService } from "../../shared/state/statistiques"

import {
  JhiEventManager,
  JhiParseLinks,
  JhiPaginationUtil,
  JhiLanguageService,
  JhiAlertService
} from "ng-jhipster";
declare let select_init: any;


@Component({
    selector: 'jhi-credit-comity-fiche-dossiers',
    templateUrl: './credit-comity-fiche-dossiers.component.html',
    styleUrls: ['../../shared/state/state.scss']
})
export class CreditCommityFicheDossiersComponent implements OnInit, OnDestroy {
    routeSub: any;
    private _currentCreditComityDossiers: any[];
    private _currentCreditComityFicheDossiers:any[];
    private _DePage: any;
    private imageUrl = READFILEURL;

    constructor(
        private route: ActivatedRoute,
        public langue: LanguesService,
        private creditComityService: CreditComityService,
        public _stateService:StateService

        // private creditComityPopupService: CreditComityPopupService
    ) { }

    ngAfterViewInit() {
      select_init();
    }

    get currentCreditComityDossiers(): any[] {
      return this._currentCreditComityDossiers;
  }

    public showDossiers(creditComityId: number): void {
      this.creditComityService.showDossier(creditComityId)
      .subscribe((data) => {
          this._currentCreditComityDossiers = data;
      });
    }
 ngOnInit(): void {
    this._DePage = UserData.getInstance().sfd_;
    this.routeSub = this.route.params.subscribe((params: any[]) => {
        const creditComityId: number = parseInt(params['id']);
        this.showFicheDossiers(creditComityId);
 });
}

    ngOnDestroy() {
        this.routeSub.unsubscribe();

    }

    public showFicheDossiers(creditComityDossierId: number): void {
         this.creditComityService.showFicheDossier(creditComityDossierId)
        .subscribe((data) => {
            if(data[0].reference != null)
            this._currentCreditComityFicheDossiers = data;
         });
    }

    public printAsPdf(print){
      this._stateService.printAsPdf(print)
    }
}
