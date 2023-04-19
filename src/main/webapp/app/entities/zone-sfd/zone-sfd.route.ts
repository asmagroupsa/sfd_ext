import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ZoneSfdComponent } from './zone-sfd.component';
import { ZoneSfdDetailComponent } from './zone-sfd-detail.component';
import { ZoneSfdPopupComponent } from './zone-sfd-dialog.component';
import { ZoneSfdDeletePopupComponent } from './zone-sfd-delete-dialog.component';

@Injectable()
export class ZoneSfdResolvePagingParams implements Resolve<any> {

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

export const zoneSfdRoute: Routes = [
    {
        path: 'zone-sfd',
        component: ZoneSfdComponent,
        resolve: {
            'pagingParams': ZoneSfdResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneSfd.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'zone-sfd/:id',
        component: ZoneSfdDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneSfd.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const zoneSfdPopupRoute: Routes = [
    {
        path: 'zone-sfd-new',
        component: ZoneSfdPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneSfd.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'zone-sfd/:id/edit',
        component: ZoneSfdPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneSfd.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'zone-sfd/:id/delete',
        component: ZoneSfdDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.zoneSfd.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
