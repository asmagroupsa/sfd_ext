import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ClientConditionValueComponent } from './client-condition-value.component';
import { ClientConditionValueDetailComponent } from './client-condition-value-detail.component';
import { ClientConditionValuePopupComponent } from './client-condition-value-dialog.component';
import { ClientConditionValueDeletePopupComponent } from './client-condition-value-delete-dialog.component';

@Injectable()
export class ClientConditionValueResolvePagingParams implements Resolve<any> {

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

export const clientConditionValueRoute: Routes = [
    {
        path: '',
        component: ClientConditionValueComponent,
        resolve: {
            'pagingParams': ClientConditionValueResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionValue.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: ':id',
        component: ClientConditionValueDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionValue.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const clientConditionValuePopupRoute: Routes = [
    {
        path: 'client-condition-value-new',
        component: ClientConditionValuePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionValue.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'client-condition-value/:id/edit',
        component: ClientConditionValuePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionValue.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'client-condition-value/:id/delete',
        component: ClientConditionValueDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionValue.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
