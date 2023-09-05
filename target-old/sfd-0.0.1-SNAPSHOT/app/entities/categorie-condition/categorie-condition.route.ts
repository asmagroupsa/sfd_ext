import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { CategorieConditionComponent } from './categorie-condition.component';
import { CategorieConditionDetailComponent } from './categorie-condition-detail.component';
import { CategorieConditionPopupComponent } from './categorie-condition-dialog.component';
import { CategorieConditionDeletePopupComponent } from './categorie-condition-delete-dialog.component';

@Injectable()
export class CategorieConditionResolvePagingParams implements Resolve<any> {

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

export const categorieConditionRoute: Routes = [
    {
        path: '',
        component: CategorieConditionComponent,
        resolve: {
            'pagingParams': CategorieConditionResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.categorieCondition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: ':id',
        component: CategorieConditionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.categorieCondition.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const categorieConditionPopupRoute: Routes = [
    {
        path: 'categorie-condition-new',
        component: CategorieConditionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.categorieCondition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'categorie-condition/:id/edit',
        component: CategorieConditionPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.categorieCondition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'categorie-condition/:id/delete',
        component: CategorieConditionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.categorieCondition.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
