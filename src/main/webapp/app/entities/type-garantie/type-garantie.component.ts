import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from 'ng-jhipster';

import { TypeGarantie } from './type-garantie.model';
import { TypeGarantieService } from './type-garantie.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { ConditionGarantieService } from '../condition-garantie/condition-garantie.service';
import { ConditionGarantie } from '../condition-garantie/condition-garantie.model';
declare let select_init: any;
declare let modal: any;
declare let jQuery: any;
declare let modalHide: any;
@Component({
    selector: 'jhi-type-garantie',
    templateUrl: './type-garantie.component.html'
})
export class TypeGarantieComponent implements OnInit, OnDestroy {
    conditionOptions: ConditionGarantie[];
    added: any[];
    currentType: TypeGarantie;
    typeGaranties: TypeGarantie[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    model: any;
    itemsPerPage: any;
    page: any;

    constructor(
        private typeGarantieService: TypeGarantieService,
        private conditionGarantieService: ConditionGarantieService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        public principal: Principal,
        public langue: LanguesService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
    }
    ngAfterViewInit() {
        select_init();
    }
    getConditions() {
        this.conditionGarantieService.query().subscribe((res: ResponseWrapper) => {
            this.conditionOptions = res.json;
        });
    }

    loadAll() {
        /* if (this.currentSearch) {
            this.typeGarantieService
            .query({
                'name.contains': this.currentSearch,
                NO_QUERY: true
            })
            .subscribe(
                (res: ResponseWrapper) => {
                    this.typeGaranties = res.json;
                    select_init();
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
            return;
        } */
        this.typeGarantieService
            .query({
                'name.contains': this.currentSearch,
                size: 1000,
                NO_QUERY: true
            })
            .subscribe(
                (res: ResponseWrapper) => {
                    this.typeGaranties = res.json;
                    // if (!this.currentSearch) {
                    //     this.currentSearch = '';
                    // }
                    select_init();
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    getcurrent(typeGarantie: TypeGarantie) {
        this.currentType = typeGarantie;
        this.model = this.currentType.conditionGaranties;
        /* let position = jQuery(".scroll").offset().top;
        jQuery("html,body").animate({ scrollTop: position }, 1000); */
    }
    ngOnInit() {
        this.loadAll();
        this.getConditions();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInTypeGaranties();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: TypeGarantie) {
        return item.id;
    }
    registerChangeInTypeGaranties() {
        this.eventSubscriber = this.eventManager.subscribe(
            'typeGarantieListModification',
            response => this.loadAll()
        );
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
    closeModal(selector: string = '.ui.tiny.modal.garantie') {
        modalHide(selector);
    }
    showModal(type: TypeGarantie) {
        this.getcurrent(type);
        modal('.ui.tiny.modal.garantie');
    }
    openModal(type: TypeGarantie) {
        this.getcurrent(type);
        modal('.ui.tiny.modal.garantie-liste');
    }
    process() {
        modalHide('.ui.tiny.modal.garantie');
        this.currentType.conditionGaranties = this.model.conditionGaranties;
        this.addCondition();
    }
    private addCondition() {
        this.typeGarantieService.update(this.currentType).subscribe(
            res => {
            },
            res => {

            }
        );
    }
}
