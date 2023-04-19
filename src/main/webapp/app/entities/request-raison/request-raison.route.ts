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

import { RequestRaisonComponent } from './request-raison.component';
import { RequestRaisonDetailComponent } from './request-raison-detail.component';
import { RequestRaisonPopupComponent } from './request-raison-dialog.component';
import { RequestRaisonDeletePopupComponent } from './request-raison-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class RequestRaisonResolvePagingParams implements Resolve<any> {
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

export const requestRaisonRoute: Routes = [
  {
    path: '',
    component: RequestRaisonComponent,
    resolve: {
      pagingParams: RequestRaisonResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.requestRaison.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: RequestRaisonDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.requestRaison.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const requestRaisonPopupRoute: Routes = [
  {
    path: 'request-raison-new',
    component: RequestRaisonPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.requestRaison.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'request-raison/:id/edit',
    component: RequestRaisonPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.requestRaison.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'request-raison/:id/delete',
    component: RequestRaisonDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.requestRaison.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
