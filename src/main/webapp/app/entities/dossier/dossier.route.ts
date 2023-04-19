import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { DossierComponent } from './dossier.component';
import { DossierDetailComponent } from './dossier-detail.component';
import { DossierPopupComponent } from './dossier-dialog.component';
import { DossierDeletePopupComponent } from './dossier-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class DossierResolvePagingParams implements Resolve<any> {

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

export const dossierRoute: Routes = [
    {
        path: 'dossier',
        component: DossierComponent,
        resolve: {
            'pagingParams': DossierResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.dossier.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'dossier/:id',
        component: DossierDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.dossier.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const dossierPopupRoute: Routes = [
    {
        path: 'dossier-new',
        component: DossierPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.dossier.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'dossier/:id/edit',
        component: DossierPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.dossier.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'dossier/:id/delete',
        component: DossierDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.dossier.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
