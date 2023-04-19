import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { AuthorityResourceComponent } from './authority-resource.component';
import { AuthorityResourceDetailComponent } from './authority-resource-detail.component';
import { AuthorityResourcePopupComponent } from './authority-resource-dialog.component';
import { AuthorityResourceDeletePopupComponent } from './authority-resource-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class AuthorityResourceResolvePagingParams implements Resolve<any> {

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

export const authorityResourceRoute: Routes = [
    {
        path: 'authority-resource',
        component: AuthorityResourceComponent,
        resolve: {
            'pagingParams': AuthorityResourceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.authorityResource.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'authority-resource/:id',
        component: AuthorityResourceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.authorityResource.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const authorityResourcePopupRoute: Routes = [
    {
        path: 'authority-resource-new',
        component: AuthorityResourcePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.authorityResource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'authority-resource/:id/edit',
        component: AuthorityResourcePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.authorityResource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'authority-resource/:id/delete',
        component: AuthorityResourceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.authorityResource.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
