import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ElementConditionComponent } from './element-condition.component';
import { ElementConditionDetailComponent } from './element-condition-detail.component';
import { ElementConditionPopupComponent } from './element-condition-dialog.component';
import { ElementConditionDeletePopupComponent } from './element-condition-delete-dialog.component';

@Injectable()
export class ElementConditionResolvePagingParams implements Resolve<any> {

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

export const elementConditionRoute: Routes = [
    {
        path: '',
        component: ElementConditionComponent,
        resolve: {
            'pagingParams': ElementConditionResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.elementCondition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: ':id',
        component: ElementConditionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.elementCondition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const elementConditionPopupRoute: Routes = [
    {
        path: 'element-condition-new',
        component: ElementConditionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.elementCondition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'element-condition/:id/edit',
        component: ElementConditionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.elementCondition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'element-condition/:id/delete',
        component: ElementConditionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.elementCondition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
