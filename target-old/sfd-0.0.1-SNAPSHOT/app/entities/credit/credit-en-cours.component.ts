import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    OnChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from 'ng-jhipster';

import { Credit } from './credit.model';
import { CreditService } from './credit.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper, UserData } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';

@Component({
    selector: 'jhi-credit-en-cours',
    templateUrl: './credit-en-cours.component.html',
    styleUrls: ['../../shared/state/state.scss']
})
export class CreditEnCoursComponent {
    credits: any[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    date: any;

    constructor(
        private creditService: CreditService,
        private parseLinks: JhiParseLinks,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService
    ) {
    }
    onDateChange(ev: any) {
        this.date = ev;
        if (this.date) {
            let date: string = `${this.date.year}/${this.date.month}/${this.date.day}`;
            this.credits = [];
            this.loadAll(date);
        }
    }
    loadAll(date?: string) {
        let d = new Date();
        date = date || `${d.getFullYear()}/${d.getMonth()}/${d.getDate()}`;
        this.creditService
            .listeEncoursCredit(date)
            .subscribe(
                (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }

    ngOnInit() {
        this.loadAll();
        this.registerChangeInCredits();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Credit) {
        return item.id;
    }
    registerChangeInCredits() {
        this.eventSubscriber = this.eventManager.subscribe(
            'creditListModification',
            response => this.loadAll()
        );
    }

    private onSuccess(data, headers) {
        this.credits = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
