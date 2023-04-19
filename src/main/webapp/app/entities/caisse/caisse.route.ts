import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CaisseComponent } from './caisse.component';
import { CaisseDetailComponent } from './caisse-detail.component';
import { CaissePopupComponent } from './caisse-dialog.component';
import { CaisseDeletePopupComponent } from './caisse-delete-dialog.component';

@Injectable()
export class CaisseResolvePagingParams implements Resolve<any> {

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

export const caisseRoute: Routes = [
    {
        path: '',
        component: CaisseComponent,
        resolve: {
            'pagingParams': CaisseResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisse.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: ':id',
        component: CaisseDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisse.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const caissePopupRoute: Routes = [
    {
        path: 'caisse-new',
        component: CaissePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisse.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'caisse/:id/edit',
        component: CaissePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisse.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'caisse/:id/delete',
        component: CaisseDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisse.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
