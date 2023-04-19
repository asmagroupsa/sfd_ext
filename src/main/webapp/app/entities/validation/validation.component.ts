import { ComityMber } from '../comity-menu/comity-menu.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {ValidationObservationDialogComponent} from './validation-observation-dialog';
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiAlertService
} from 'ng-jhipster';

import { Validation } from './validation.model';
import { ValidationService } from './validation.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CreditComity } from '../credit-comity/credit-comity.model';
declare let select_init: any;
@Component({
    selector: 'jhi-validation',
    templateUrl: './validation.component.html',
    styles: [`
        .badge-attente{
            display: inline-block;
            border-radius: 100%;
            width: 10px;
            height: 20px;
        }
    `]
})
export class ValidationComponent implements OnInit, OnDestroy {
    member: any;
    comities: CreditComity[];
    fragment: string;
    currentAccount: any;
    validations: any[];
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
    currentComity: any;
    states = [
        { code: 'TOUS', libelle: 'Tous' },
        { code: 'ACCEPTER', libelle: 'Acceptés' },
        { code: 'ATTENTE', libelle: 'Mis en attente' },
        { code: 'REJETER', libelle: 'Rejetés' }
    ];
    expired:boolean = false;
    currentStateCode = this.states[0].code;
    flag = { ACCEPTER: '#00ff1159', ATTENTE: '#ffa500', REJETER: '#FF5C5C' };
    flagClass = { ACCEPTER: 'accepter', ATTENTE: 'attente', REJETER: 'rejeter' };

    constructor(
        private validationService: ValidationService,
        private creditComityService: CreditComityService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService,
        private modalService: NgbModal
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
        activatedRoute.fragment.subscribe(fragment => {
            this.fragment = fragment;
        });

        this.comities = [];
    }
    toggleExpired() {
        this.expired = !this.expired;
        select_init();
        setTimeout(() => {
            select_init();
        }, 1000);
    }
    showObservation(validation){
const modalRef = this.modalService.open(ValidationObservationDialogComponent, {
      size: 'lg',keyboard:false,
      backdrop: 'static'
    });
    modalRef.componentInstance.validation = validation;
    }
    ngAfterViewInit() {
        select_init();
    }
    getDossiers() {
        this.creditComityService.query({ size: 1000 }).subscribe(
            (res: ResponseWrapper) => {
                this.comities = res.json;
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }
    loadAll() { }
    loadPage(page: number) {
        // this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/entity', 'validation'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        });
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/entity',
            'validation',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate([
            '/entity',
            'validation',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
    }
    ngOnInit() {
        this.getDossiers();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInValidations();
    }
    remettreDossierEncircuit(id) {
        if (!id) return;
        this.validationService.remettreDossierEncircuit(id)
            .subscribe(
                (res: ResponseWrapper) => {
                    if (res.json.resultat == 'OK') {
                        this.validations = this.validations.filter((validation) => {
                            return validation.dossier != id;
                        });
                        this.alertService.success("Dossier remis dans le circuit");
                        this.router.navigate(['/entity', 'dossier', { outlets: { popup: ['dossier-new'] } }], { queryParams: { comity: this.currentComity.id }, fragment: "attente" });
                    } else if (res.json.resultat == 'NON') {
                        this.alertService.error("La mise en circuit du dossier a echoué");
                    } else if (res.json.resultat == 'DOSSIER_NON_ATTENTE') {
                        this.alertService.error("Le dossier n'est pas mise en attente");
                    }
                }
            );
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Validation) {
        return item.id;
    }
    registerChangeInValidations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'validationListModification',
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

        /* if (this.pagingParams && this.pagingParams.page)
            this.page = this.pagingParams.page; */

        this.validations = data;
        select_init();
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
    onChange() {
        if (!this.currentComity || !this.currentComity.id) return;
        if (this.currentComity.delegationComity['delegatedMembers'].length) {
            let member = this.currentComity.delegationComity['delegatedMembers'].find(element => {
                return element.status;
            });
            this.member = member ? member.id : 0;
            if (!this.member) alert("Tous les membres délégués sont désactivés");
        } else {
            this.member = 0;
            alert(`La délégation ${this.currentComity.delegationComity.libelle} liée au comité n'a pas de membres pour valider les dossiers.Veuillez en ajouter les membres`);
        }

        if (this.member) {
            this.validationService
                .queryValidations({
                    comite: this.currentComity.id,
                    member: this.member,
                    valide: true
                })
                .subscribe(
                    (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                    (res: ResponseWrapper) => this.onError(res.json)
                );
        } else {
            this.validations = [];
        }
    }

    getValidationsByState(code = this.states[0].code) {
        if (!this.currentComity || !this.currentComity.id) return [];
        if (code === this.states[0].code) {
            return this.validations;
        }
        let validations = this.validations.filter(v => v.resultat === code);
        select_init();
        return validations;
    }
}
