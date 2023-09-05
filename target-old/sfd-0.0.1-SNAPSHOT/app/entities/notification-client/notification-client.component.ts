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

import { NotificationClient } from './notification-client.model';
import { NotificationClientService } from './notification-client.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { FormationService } from '../formation/formation.service';
import { Formation } from '../formation/formation.model';
declare let select_init: any;
declare let modal: any;
declare let jQuery: any;
declare let modalHide: any;
declare let clearDropdown:any;

@Component({
    selector: 'jhi-notification-client',
    templateUrl: './notification-client.component.html'
})
export class NotificationClientComponent implements OnInit, OnDestroy {
    currentNotification: NotificationClient;
    formations: Formation[];
    model: Formation[];
    notifications: any[] = [];
    currentAccount: any;
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
isSaving:boolean =false;
types: any[] = [
        {
            label: 'Notifications non formées',
            code: 'NON_FORME'
        },
        {
            label: 'Historique des notifications',
            code: 'HISTORIQUE'
        }
    ];
    currentType: any;
    constructor(
        private notificationClientService: NotificationClientService,
        private parseLinks: JhiParseLinks,
        private formationService: FormationService,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService
    ) {
        this.currentType = this.types[0];
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
    }
    ngAfterViewInit() {
        select_init();
    }
    changeType(t) {
        this.currentType = t;
        this.loadAll();
    }
    loadAll() {
        this.notifications = [];
         if (this.currentSearch) {
      this.notificationClientService
        .search({
          query: this.currentSearch,
          size: this.itemsPerPage,
          sort: this.sort()
        })
        .subscribe(
          (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
          (res: ResponseWrapper) => this.onError(res.json)
        );
      return;
    }
   /*  if(this.currentType.code === 'HISTORIQUE'){
    this.notificationClientService
      .query({ size: 1000 })
      .subscribe(
        (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
        (res: ResponseWrapper) => this.onError(res.json)
      );
      return ;
    } */
        this.getNotifiers();
    }
    loadPage(page: number) {
        //this.page = page;
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    transition() {
        this.router.navigate(['/entity', 'notification-client'], {
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
        /* this.router.navigate([
            '/entity',
            'notification-client',
            {
                page: this.page,
                sort: thiss.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
        this.loadAll(); */
    }
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.page = 0;
        this.currentSearch = query;
        this.router.navigate([
            '/entity',
            'notification-client',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'desc' : 'asc')
            }
        ]);
        this.loadAll();
    }
    getNotifiers() {
        this.notificationClientService
            .queryNotification({
                historique:this.currentType.code === 'HISTORIQUE'?'historique':null
            })
            .subscribe((res: ResponseWrapper) => {
                this.notifications = res.json;
                select_init();
            });
    }
    ngOnInit() {
        this.loadAll();
        this.formationService.query({ size: 1000, NO_QUERY: true }).subscribe(
            (res: ResponseWrapper) => {
                this.formations = res.json;
            },
            (res: ResponseWrapper) => {}
        );
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInNotificationClients();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: NotificationClient) {
        return item.id;
    }
    registerChangeInNotificationClients() {
        this.eventSubscriber = this.eventManager.subscribe(
            'notificationClientListModification',
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
        select_init();
        this.notifications = data;
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
    openModal(notificationClient: NotificationClient) {
        this.currentNotification = notificationClient;
        modal('.ui.tiny.modal.formation');
    }
    closeModal() {
        modalHide('.ui.tiny.modal.formation');
        this.model = [];
        clearDropdown('.content.formation .ui.dropdown');
    }
    addFormations() {
        this.isSaving = true;
        this.notificationClientService
            .find(this.currentNotification.id)
            .subscribe((res: NotificationClient) => {
                let notificationClient: NotificationClient = res;
                if (notificationClient.notificationDate) {
                    notificationClient.notificationDate = {
                        year: notificationClient.notificationDate.getFullYear(),
                        month:
                            notificationClient.notificationDate.getMonth() + 1,
                        day: notificationClient.notificationDate.getDate()
                    };
                }
                if (notificationClient.createdDate) {
                    notificationClient.createdDate = {
                        year: notificationClient.createdDate.getFullYear(),
                        month: notificationClient.createdDate.getMonth() + 1,
                        day: notificationClient.createdDate.getDate()
                    };
                }
                if (notificationClient.lastModifiedDate) {
                    notificationClient.lastModifiedDate = {
                        year: notificationClient.lastModifiedDate.getFullYear(),
                        month:
                            notificationClient.lastModifiedDate.getMonth() + 1,
                        day: notificationClient.lastModifiedDate.getDate()
                    };
                }
                notificationClient.formations = this.model;
                this.notificationClientService
                    .update(notificationClient)
                    .subscribe(
                        (res: NotificationClient) => {
                            this.isSaving = false;
                            this.notifications = this.notifications.filter(
                                notif => {
                                    return (
                                        notif.id != this.currentNotification.id
                                    );
                                }
                            );
                            this.closeModal();
                            this.currentNotification = null;
                            this.model = [];
                            this.alertService.success('');
                            this.getNotifiers();
                        },
                        () => {
                            this.isSaving = false;
                            this.model = [];
                            clearDropdown('.content.formation .ui.dropdown');
                            this.alertService.error('');
                        }
                    );
            });
    }
}
