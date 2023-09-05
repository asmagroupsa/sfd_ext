import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks, JhiPaginationUtil, JhiLanguageService, JhiAlertService } from 'ng-jhipster';

import { TypeMembre } from './type-membre.model';
import { TypeMembreService } from './type-membre.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';

@Component({
    selector: 'jhi-type-membre',
    templateUrl: './type-membre.component.html'
})
export class TypeMembreComponent implements OnInit, OnDestroy {
typeMembres: TypeMembre[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private typeMembreService: TypeMembreService,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        public  principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.typeMembreService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.typeMembres = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.typeMembreService.query().subscribe(
            (res: ResponseWrapper) => {
                this.typeMembres = res.json;
                this.currentSearch = '';
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
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInTypeMembres();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: TypeMembre) {
        return item.id;
    }
    registerChangeInTypeMembres() {
        this.eventSubscriber = this.eventManager.subscribe('typeMembreListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
