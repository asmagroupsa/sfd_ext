import { Component, OnInit, OnDestroy,ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
// import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
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
    selector: 'jhi-credit-comity-fiche-dossiers-comity-member',
    templateUrl: './credit-comity-fiche-dossiers-comity-member.component.html',
    styleUrls: ['../../shared/state/state.css']
})
export class CreditCommityFicheDossiersComityMemberComponent implements OnInit, OnDestroy {
    routeSub: any;
    private _currentCreditComityDossiers: any[];
    private _currentCreditComityFicheDossiersComityMember:any[];
    private _DePage: any;
    private imageUrl = READFILEURL;

    constructor(
        private route: ActivatedRoute,
        public langue: LanguesService,
        private creditComityService: CreditComityService,
        public _stateService:StateService,
        private creditComityPopupService: CreditComityPopupService
    ) { }

    ngAfterViewInit() {
      select_init();
    }
  //
    get currentCreditComityDossiers(): any[] {
      return this._currentCreditComityDossiers;
  }

    ngOnInit(): void {
      this._DePage = UserData.getInstance().sfd_;
      this.routeSub = this.route.params.subscribe((params: any[]) => {
        const creditComityId: number = parseInt(params['id']);
        this.showFicheDossiersComityMember(creditComityId);
 });
}

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }

    public showFicheDossiersComityMember(creditComityDossierId: number): void {
         this.creditComityService.showFicheDossierComityMember(creditComityDossierId)
        .subscribe((data) => {
            this._currentCreditComityFicheDossiersComityMember = data;
         });
    }

    public printAsPdf(print){
      this._stateService.printAsPdf(print)
    }
}
