import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Routes,
    CanActivate
} from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { AssuranceComponent } from './assurance.component';
import { AssuranceDetailComponent } from './assurance-detail.component';
import { AssurancePopupComponent } from './assurance-dialog.component';
import { AssuranceDeletePopupComponent } from './assurance-delete-dialog.component';
import { AssuranceReleveComponent } from './asurance-ayant-droit.component';

@Injectable()
export class AssuranceResolvePagingParams implements Resolve<any> {
    constructor(private paginationUtil: JhiPaginationUtil) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort']
            ? route.queryParams['sort']
            : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const assuranceRoute: Routes = [
    {
        path: '',
        component: AssuranceComponent,
        resolve: {
            pagingParams: AssuranceResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.assurance.home.title'
        },
        canActivate: [UserRouteAccessService]
    },

    {
        path: ':numPolice/assurance-releve',
        component: AssuranceReleveComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.assurance.home.title'
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id',
        component: AssuranceDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.assurance.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const AssurancePopupRoute: Routes = [
    {
        path: 'assurance-new',
        component: AssurancePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.assurance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'assurance/:id/edit',
        component: AssurancePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.assurance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'assurance/:id/delete',
        component: AssuranceDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.assurance.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
];
