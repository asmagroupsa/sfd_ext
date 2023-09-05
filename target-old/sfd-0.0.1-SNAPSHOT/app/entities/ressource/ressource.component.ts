import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { JhiProfileService } from '../../admin/profile/profile.service';
import {
    JhiEventManager,
    JhiParseLinks,
    JhiPaginationUtil,
    JhiLanguageService,
    JhiAlertService
} from 'ng-jhipster';

import { Ressource } from './ressource.model';
import { RessourceService } from './ressource.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import { LanguesService } from '../../shared/myTranslation/langues';
import { UserService } from '../../shared/user/user.service';
declare let dimmerShow: any;
declare let select_init: any;
declare let switchToggle: any;
declare let modal: any;
declare let modalHide: any;

@Component({
    selector: 'jhi-ressource',
    templateUrl: './ressource.component.html'
})
export class RessourceComponent implements OnInit, OnDestroy {
    isSelected: boolean = false;
    isSaving: boolean = false;
    users: any[] = [];
    currentAccount: any;
    ressources: Ressource[];
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
    predicate: any;
    previousPage: any;
    reverse: any;
    step: number = 0;
    profiles: number[] = [];
    model: any = {
        name: '',
        description: ''
    };
    isSuperAdmin:boolean = false;
    constructor(
        private ressourceService: RessourceService,
        private parseLinks: JhiParseLinks,
        private userService: UserService,
        private alertService: JhiAlertService,
        public principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private profileService: JhiProfileService,
        private eventManager: JhiEventManager,
        private paginationUtil: JhiPaginationUtil,
        private paginationConfig: PaginationConfig,
        public langue: LanguesService
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data['pagingParams'].page;
            this.previousPage = data['pagingParams'].page;
            this.reverse = data['pagingParams'].ascending;
            this.predicate = data['pagingParams'].predicate;
        });
        this.currentSearch = activatedRoute.snapshot.params['search']
            ? activatedRoute.snapshot.params['search']
            : '';
            if(this.principal.userIdentity)
            this.isSuperAdmin = /superAdminSfd/i.test(this.principal.userIdentity.login);
    }

    ngAfterViewInit() {
        switchToggle();
        select_init();
    }

    loadAllUsers() {
        this.userService
            .authoritys({ size: 1000 })
            .subscribe(
                (res: any[]) => this.onSuccessUsers(res),
                (res: ResponseWrapper) => this.onError(res.json)
            );
    }
    loadAll() {
        if (this.currentSearch) {
            this.ressourceService
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
        /* this.ressourceService
          .query({
            size: 1000
          })
          .subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
          ); */
    }
    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }
    save() {
        if (!this.model.name) return;
        if (!this.model.description) return;
        this.isSaving = true;
        /* if (this.isDeleting) {
          this.profileService.deleteProfile(this.model.name).subscribe(() => {
            this.getAllProfiles();
            this.clearModal();
          });
        } else  */
        /* if (this.isModifying) {
          this.profileService.updateProfile(this.model).subscribe(() => {
            this.getAllProfiles();
            this.clearModal();
          });
        } else if (this.isAdding) { */
        this.profileService.createProfile(this.model).subscribe(() => {
            this.clearModal();
            this.loadAllUsers();
            this.isSaving = false;
        });
        //}
    }
    transition() {
        this.router.navigate(['/entity', 'ressource'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                search: this.currentSearch,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.currentSearch = '';
        this.router.navigate([
            '/entity',
            'ressource',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
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
            'ressource',
            {
                search: this.currentSearch,
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }
    ngOnInit() {
        this.loadAllUsers();
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInRessources();
    }

    ngOnDestroy() {
        if(this.eventSubscriber) this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Ressource) {
        return item.id;
    }
    registerChangeInRessources() {
        this.eventSubscriber = this.eventManager.subscribe(
            'ressourceListModification',
            response => this.loadAllUsers()
        );
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
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
        // this.page = pagingParams.page;
        this.ressources = data.map(ressource => {
            ressource['selected'] = false;
            return ressource;
        });
        select_init();
    }
    private onSuccessUsers(data) {
        let user: any;

        this.users = data.map(authority => {
            user = {};
            user['selected'] = false;
            user['authority'] = authority.name;
            user['description'] = authority.description;
            return user;
        });
        select_init();
    }
    clearModal() {
        modalHide('#profile-modal');
        this.model = { name: '', description: '' };
    }
    createProfile() {
        this.isSaving = false;
        this.model = { name: '', description: '' };
        modal('#profile-modal');
    }
    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
    stepTo(step: number) {
        if (step == 1) {
            if (!this.profileHasSelected()) {
                return;
            }
        } else if (step == 2) {
            if (!this.ressourcesHasSelected()) {
                return;
            }
        }
        this.step = step;
        if (step == 2) {
            this.addRessourcesToProfiles();
        }
    }
    addProfileRessources() {

    }
    addRessourcesToProfiles(): void {
        dimmerShow(true, '.ui.page.dimmer');
        let ressourcesModel: any = {};
        let ressourcesSelected = this.ressources.filter(ressource => {
            return ressource['selected'];
        });
        this.users.forEach((user, index) => {
            if (user['selected']) {
                ressourcesSelected.forEach((ressource, i) => {
                    ressourcesModel['authority'] = user['authority'];
                    ressourcesModel['ressource_id'] = ressource.id;

                    ((currentIndex, currentI) => {
                        this.ressourceService
                            .addAuthorityRessources(ressourcesModel)
                            .subscribe(
                                json => {
                                    if (
                                        currentIndex + 1 == this.users.length &&
                                        currentI + 1 == ressourcesSelected.length
                                    )
                                        dimmerShow(false, '.ui.page.dimmer');
                                },
                                () => {
                                    dimmerShow(false, '.ui.page.dimmer');
                                }
                            );
                    })(index, i);
                });
            }
        });
    }
    getProfileRessources() { }
    toggleAll() {
        this.isSelected = !this.isSelected;
        this.ressources = this.ressources.map(user => {
            user['selected'] = this.isSelected;
            return user;
        });

        select_init();
    }
    profileHasSelected(): boolean {
        let selected: boolean = false;
        this.users.forEach(user => {
            if (user['selected']) {
                selected = true;
                return true;
            }
        });
        return selected;
    }
    ressourcesHasSelected(): boolean {
        let selected: boolean = false;
        this.ressources.forEach(ressource => {
            if (ressource['selected']) {
                selected = true;
                return true;
            }
        });
        return selected;
    }
    check(model: any) {
        model['selected'] = !model['selected'];
        this.step = 1;
    }
}
