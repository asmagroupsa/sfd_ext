import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';
import { UserMgmtComponent } from './user-management.component';
import { UserMgmtDetailComponent } from './user-management-detail.component';
import { UserDialogComponent } from './user-management-dialog.component';
import { UserDeleteDialogComponent } from './user-management-delete-dialog.component';
import { UserMgmtRessourcesComponent } from './user-management-ressources.component';
import { GuichetierComponent } from './guichetier.component';
import { GuichetierPrintComponent } from './guichetier-print.component'
import { Principal } from '../../shared';


@Injectable()
export class UserResolve implements CanActivate {

    constructor(private principal: Principal) { }

    canActivate() {
        return this.principal.identity().then((account) => this.principal.hasAnyAuthority(['ROLE_ADMIN']));
    }
}

@Injectable()
export class UserResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,desc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const userMgmtRoute: Routes = [
    {
        path: 'user-management',
        component: UserMgmtComponent,
        resolve: {
            'pagingParams': UserResolvePagingParams
        },
        data: {
            pageTitle: 'userManagement.home.title'
        }
    },
    {
        path: 'guichetiers',
        component: GuichetierComponent,
        resolve: {
            'pagingParams': UserResolvePagingParams
        },
        data: {
            pageTitle: 'userManagement.home.title'
        }
    },
    {
        path: 'guichetiers/:id/print',
        component: GuichetierPrintComponent,
        resolve: {
            'pagingParams': UserResolvePagingParams
        },
        data: {
            pageTitle: 'userManagement.home.title'
        }
    },
    {
        path: 'ressources-add/:login/:id',
        component: UserMgmtRessourcesComponent,
        resolve: {
            'pagingParams': UserResolvePagingParams
        },
        data: {
            pageTitle: 'userManagement.home.title'
        }
    },
    {
        path: 'user-management/:login',
        component: UserMgmtDetailComponent,
        data: {
            pageTitle: 'userManagement.home.title'
        }
    }
];

export const userDialogRoute: Routes = [
    {
        path: 'user-management-new',
        component: UserDialogComponent,
        outlet: 'popup'
    },
    {
        path: 'user-management/:login/edit',
        component: UserDialogComponent,
        outlet: 'popup'
    },
    {
        path: 'user-management/:login/delete',
        component: UserDeleteDialogComponent,
        outlet: 'popup'
    }
];
