import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ZoneDepartementComponent } from './zone-departement.component';
import { ZoneDepartementDetailComponent } from './zone-departement-detail.component';
import { ZoneDepartementPopupComponent } from './zone-departement-dialog.component';
import { ZoneDepartementDeletePopupComponent } from './zone-departement-delete-dialog.component';

@Injectable()
export class ZoneDepartementResolvePagingParams implements Resolve<any> {

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

export const zoneDepartementRoute: Routes = [
    {
        path: 'zone-departement',
        component: ZoneDepartementComponent,
        resolve: {
            'pagingParams': ZoneDepartementResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneDepartement.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'zone-departement/:id',
        component: ZoneDepartementDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneDepartement.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const zoneDepartementPopupRoute: Routes = [
    {
        path: 'zone-departement-new',
        component: ZoneDepartementPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneDepartement.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'zone-departement/:id/edit',
        component: ZoneDepartementPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneDepartement.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'zone-departement/:id/delete',
        component: ZoneDepartementDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneDepartement.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
