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

import { TauxEpargneComponent } from './taux-epargne.component';
import { TauxEpargneDetailComponent } from './taux-epargne-detail.component';
import { TauxEpargnePopupComponent } from './taux-epargne-dialog.component';
import { TauxEpargneDeletePopupComponent } from './taux-epargne-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TauxEpargneResolvePagingParams implements Resolve<any> {
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

export const tauxEpargneRoute: Routes = [
  {
    path: '',
    component: TauxEpargneComponent,
    resolve: {
      pagingParams: TauxEpargneResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxEpargne.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TauxEpargneDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxEpargne.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const tauxEpargnePopupRoute: Routes = [
  {
    path: 'taux-epargne-new',
    component: TauxEpargnePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxEpargne.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'taux-epargne/:id/edit',
    component: TauxEpargnePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxEpargne.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'taux-epargne/:id/delete',
    component: TauxEpargneDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxEpargne.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
