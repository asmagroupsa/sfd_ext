import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {  DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiPaginationUtil, JhiParseLinks } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { HOST, ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { getNewItems } from '../../shared/model/functions';
import { LanguesService } from '../../shared/myTranslation/langues';
import { StateService } from '../../shared/state/statistiques';
import { Agence } from '../agence/agence.model';
import { AgenceService } from '../agence/agence.service';
import { LigneRequestService } from '../ligne-request/ligne-request.service';
import { NotificationSFDService } from '../notification-sfd/notification-sfd.service';
import { CreditComity } from './credit-comity.model';
import { CreditComityService } from './credit-comity.service';
import {AssocierLigneCreditComiteComponent} from "./associer-ligne-credit-comite.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { READFILEURL } from '../../shared/model/request-util';

declare let select_init: any;
declare const modal: any;
declare const modalHide: any;

@Component({
    selector: 'jhi-credit-comity',
    templateUrl: './credit-comity.component.html',
    styleUrls: ['credit-comity.component.scss']
})
export class CreditComityComponent implements OnInit, OnDestroy {
    expired: boolean = false;
    dossiers: any[];
    params: { [key: string]: any };
    currentComity: any;
    agences: Agence[];
    currentAccount: any;
    creditComities: CreditComity[] = [];
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
    synthese = {};
    fileUrl = READFILEURL;

    private _currentCreditComityDossiers: any[];
    private _currentCreditComityFicheDossiers: any[];
    ligneCredit: any;
date1: any;
    date2: any;

    constructor(
        private creditComityService: CreditComityService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        private agenceService: AgenceService,
        public langue: LanguesService,
        public _stateService: StateService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationSFDService: NotificationSFDService,
        private _datePipe:DatePipe,
        private _ligneRequestService: LigneRequestService,
        private _ngbModal: NgbModal,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.pagingParams = data['pagingParams'];
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
        activatedRoute.queryParams.subscribe(params => {
            this.params = params;
        });

        this._currentCreditComityDossiers = [];
    }
    ngAfterViewInit() {
        select_init();
    }
    onPeriodChange() {
        if (!this.date1 && !this.date2) {
            return;
        }

        this.loadAll();
     }
    toggleExpired() {
        this.expired = !this.expired;
        select_init();
        setTimeout(() => {
            select_init();
        }, 1000);
    }
    agence(id: any) {
        if (!this.agences) return new Agence();
        return this.agences.find((agence: Agence) => {
            return agence.id == id;
        });
    }
    dossierComplet(comity: CreditComity) {
        let creditComity = Object.assign({}, comity);
        if (!creditComity.dossierComplets) {
            this.router.navigate(['/entity', 'credit-comity', { outlets: { popup: 'credit-comity/' + comity.id + '/cloture' } }]);
            return;
        }
        if (creditComity.startDate) {
            creditComity.startDate = {
                year: creditComity.startDate.getFullYear(),
                month: creditComity.startDate.getMonth() + 1,
                day: creditComity.startDate.getDate()
            };
        }
        if (creditComity.endDate) {
            creditComity.endDate = {
                year: creditComity.endDate.getFullYear(),
                month: creditComity.endDate.getMonth() + 1,
                day: creditComity.endDate.getDate()
            };
        }
        if (creditComity.createdDate) {
            creditComity.createdDate = {
                year: creditComity.createdDate.getFullYear(),
                month: creditComity.createdDate.getMonth() + 1,
                day: creditComity.createdDate.getDate()
            };
        }
        if (creditComity.lastModifiedDate) {
            creditComity.lastModifiedDate = {
                year: creditComity.lastModifiedDate.getFullYear(),
                month: creditComity.lastModifiedDate.getMonth() + 1,
                day: creditComity.lastModifiedDate.getDate()
            };
        }
        creditComity.dossierComplets = !comity.dossierComplets;
        creditComity.delegationComity = null;
        delete creditComity.delegationComity;
        this.creditComityService.update(creditComity)
            .subscribe(
                (res: CreditComity) => {
                    this.alertService.success(`L'opération éffectuée.Les dossiers du comité ${comity.libelle} sont complets pour la demande de ligne de crédit`, null, null);
                    comity.dossierComplets = !comity.dossierComplets;
                },
                (res: Response) => {
                    this.alertService.error("Erreur s'est produite", null, null);
                }
            );
    }
    getAgences() {
        this.agenceService
            .query({
                size: 1000
            })
            .subscribe((res: ResponseWrapper) => {
                this.agences = res.json;
            });
    }
    loadAll() {
         const formatDate = (date) =>{
     if(!date) return null;
     return this._datePipe.transform(new Date(`${date.year}-${date.month}-${date.day}`), 'dd-MM-y');
 };
        const req: any = {
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
'createdDate.greaterOrEqualThan': formatDate(this.date1),
            'createdDate.lessOrEqualThan': formatDate(this.date2)
        };

        if (this.currentSearch) {
            req['libelle.contains'] = req['place.contains'] = req['typeValidation.contains'] = this.currentSearch;
            req.condition = 'OR';
        }

        try {
            if (this.activatedRoute.snapshot.queryParams.ligneCredit) {
                this.ligneCredit = JSON.parse(this.activatedRoute.snapshot.queryParams.ligneCredit);
            }
        }
        catch (error) {
            return;
        }

        if (this.ligneCredit && this.ligneCredit.notificationSFDId) {
            this._notificationSFDService.find(this.ligneCredit.notificationSFDId)
                .subscribe((notificationSFD) => {
                    this._ligneRequestService.find(notificationSFD.ligneRequestId)
                        .subscribe((ligneRequest) => {
                            this.creditComities = ligneRequest.creditComitys.map((c) => {
                                this.creditComityService.convertItemFromServer(c);
                                return c;
                            })
                            select_init();
                        });
                });
        }
        else {
            this.creditComityService.query(req).subscribe(
                (res: ResponseWrapper) => {
                    if (this.currentSearch) {
                        this.creditComities = this.creditComities.concat(getNewItems(this.creditComities, res.json))
                    } else this.onSuccess(res.json, res.headers);
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        }
    }
    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/entity', 'credit-comity'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/entity',
            'credit-comity',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
        this.loadAll();
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate([
            '/entity',
            'credit-comity',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.getAgences();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInCreditComities();
    }

    ngOnDestroy() {
        if (this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: CreditComity) {
        return item.id;
    }

    registerChangeInCreditComities() {
        this.eventSubscriber = this.eventManager.subscribe(
            'creditComityListModification',
            response => this.loadAll()
        );
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'desc' : 'asc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        if (headers.get('link'))
            this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        this.queryCount = this.totalItems;
        if (this.pagingParams && this.pagingParams.page) {
            //this.page = this.pagingParams.page;
        }
        this.creditComities = data;
        if (this.params['comity']) {
            /* this.currentComity = data.find(comity => {
        return comity.id == this.params["comity"];
      }); */
        }
        select_init();
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
    // showDossier(creditComity: any) {
    /* this.currentComity = creditComity;
this.creditComityService
  .showDossier(creditComity.id)
  .subscribe(dossiers => {
    this.dossiers = dossiers;
    let position = jQuery(".scroll").offset().top;
    jQuery("html,body").animate({ scrollTop: position }, 1000);
  }); */
    // }

    /* get currentCreditComityDossiers(): any[] {
        return this._currentCreditComityDossiers;
    } */

    /* showDossiersModal(creditComityId: CreditComity): void {
        this.creditComityService.showDossier(creditComityId).subscribe(data => {
            this._currentCreditComityDossiers = data;
            modal('#credit-comity-dossiers-modal');
        });
    }

    closeDossiersModal(): void {
        modalHide('#credit-comity-dossiers-modal');
    }

    showFicheDossiersModal(creditComityDossierId: number, some): void {
        this.creditComityService
            .showFicheDossier(creditComityDossierId)
            .subscribe(data => {
                if (data[0].reference != null)
                    this._currentCreditComityFicheDossiers = data;
                //     // modalHide('#credit-comity-dossiers-modal');
                modal('#credit-comity-fiche-dossiers-modal');
                this._stateService.printAsPdf(some);
            });
    } */

    showSynthseModal(id) {
        this.synthese = {};
        this.creditComityService.syntheseCreditComity(id)
            .subscribe((r) => {
                this.synthese = r.json()[0];
                this._changeDetectorRef.detectChanges();
                modal('#credit-comity-synthese');
            });
    }

    closeSynthseModal() {
        this.synthese = {};
        modalHide('#credit-comity-synthese');
    }

    jhiHasAnyRessources(ressources: string[]): boolean {
        return this.principal.hasAnyRessources(ressources);
    }

    associerLigne(creditComity) {
        const modalRef = this._ngbModal.open(AssocierLigneCreditComiteComponent);
        modalRef.componentInstance.creditComity = creditComity;
    }
}
