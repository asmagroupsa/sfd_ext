import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CustomUserComponent } from './custom-user.component';
import { CustomUserDetailComponent } from './custom-user-detail.component';
import { CustomUserPopupComponent } from './custom-user-dialog.component';
import { CustomUserDeletePopupComponent } from './custom-user-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class CustomUserResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

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

export const customUserRoute: Routes = [
    {
        path: '',
        component: CustomUserComponent,
        resolve: {
            'pagingParams': CustomUserResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.customUser.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: ':id',
        component: CustomUserDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.customUser.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const customUserPopupRoute: Routes = [
    {
        path: 'custom-user-new',
        component: CustomUserPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.customUser.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'custom-user/:id/edit',
        component: CustomUserPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.customUser.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'custom-user/:id/delete',
        component: CustomUserDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.customUser.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
