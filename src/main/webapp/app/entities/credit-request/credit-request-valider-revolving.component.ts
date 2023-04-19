import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreditRequestPopupService } from './credit-request-popup.service';
import { CreditRequestService } from './credit-request.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { ClientService } from '../client/client.service';
import { DatePipe } from '@angular/common';
import { LanguesService } from '../../shared/myTranslation/langues';
import { JhiAlertService, JhiEventManager, JhiPaginationUtil, JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';

import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { CreditRequestStatus } from '../credit-request-status/credit-request-status.model';
import { CreditRequestStatusService } from '../credit-request-status/credit-request-status.service';

declare let $: any;
@Component({
    selector: "jhi-credit-request-valider-revolving",
    templateUrl: "./credit-request-valider-revolving.component.html",
    styleUrls: ['./credit-request.component.scss']
})
export class CreditRequestValiderRevolvingComponent implements OnInit {
    chainedossier; typeValide; montant; explanation; result; user_reference; param1 : number; param2: string; msg: string;
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    pagingParams: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    constructor(
        public activeModal: NgbActiveModal,
        private _activatedRoute: ActivatedRoute,
        private creditRequestService: CreditRequestService,
        private creditRequestStatusService: CreditRequestStatusService,
        private clientService: ClientService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService,
        private _datePipe: DatePipe,
        private _location: Location
    ) {

    }

    ngOnInit() {
        console.log(+this._activatedRoute.snapshot.params.id)
        this.chainedossier = +this._activatedRoute.snapshot.params.id
        console.log(+this._activatedRoute.snapshot.params.ref)
        this.user_reference = this._activatedRoute.snapshot.params.ref
    }


    backClicked() {
        this._location.back();
    }

    test() {
        this.alertNotification()
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.result = 'ACCEPTER';
        console.log(this.chainedossier, this.typeValide, this.montant, this.explanation, this.result, this.user_reference)
        this.creditRequestService.doValidation(this.chainedossier, this.typeValide, this.montant, this.explanation, this.result, this.user_reference)
        .subscribe(
            (res: ResponseWrapper) => {
                console.log(res)
                console.log(res.json)
                console.log(res.json.resultat)
                if(res.json.resultat === 'NON') {
                    this.msg = 'Validation échouée';
                    this.alertService.error('Validation échouée');
                    this.backClicked();
                } else if(res.json.resultat === 'OK') {
                    this.msg = 'Validation effectuée';
                    this.alertService.success('Validation effectuée');
                    this.backClicked();
                } else if(res.json.resultat === 'LIGNE_INSUFISSANT') {
                    this.msg = 'Ligne insufisante';
                    this.alertService.error('Ligne insufisante');
                    this.backClicked();
                }
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }


    private onSuccess(data, headers) {
        if (headers.get('link'))
            this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        if (this.pagingParams && this.pagingParams.page) {
            //this.page = this.pagingParams.page;
        }
        // this.creditRequests = data;
        // select_init();
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

     alertNotification() {
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
      }
}

