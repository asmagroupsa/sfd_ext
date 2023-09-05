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

import { FraisComponent } from './frais.component';
import { FraisDetailComponent } from './frais-detail.component';
import { FraisPopupComponent } from './frais-dialog.component';
import { FraisDeletePopupComponent } from './frais-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class FraisResolvePagingParams implements Resolve<any> {
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

export const fraisRoute: Routes = [
  {
    path: '',
    component: FraisComponent,
    resolve: {
      pagingParams: FraisResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.frais.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: FraisDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.frais.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const fraisPopupRoute: Routes = [
  {
    path: 'frais-new',
    component: FraisPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.frais.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'frais/:id/edit',
    component: FraisPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.frais.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'frais/:id/delete',
    component: FraisDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.frais.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
