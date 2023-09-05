import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
  CanActivate
} from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { EcheancierClientComponent } from './echeancier-client.component';
import { EcheancierClientDetailComponent } from './echeancier-client-detail.component';
import { EcheancierClientPopupComponent } from './echeancier-client-dialog.component';
import { EcheancierClientDeletePopupComponent } from './echeancier-client-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class EcheancierClientResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) {}

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

export const echeancierClientRoute: Routes = [
  {
    path: '',
    component: EcheancierClientComponent,
    resolve: {
      pagingParams: EcheancierClientResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierClient.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: EcheancierClientDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierClient.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const echeancierClientPopupRoute: Routes = [
  {
    path: 'echeancier-client-new',
    component: EcheancierClientPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'echeancier-client/:id/edit',
    component: EcheancierClientPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'echeancier-client/:id/delete',
    component: EcheancierClientDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.echeancierClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
