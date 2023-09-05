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

import { PeriodicityComponent } from './compte-comptable.component';
import { PeriodicityDetailComponent } from './compte-comptable-detail.component';
import { PeriodicityPopupComponent } from './compte-comptable-dialog.component';
import { PeriodicityDeletePopupComponent } from './compte-comptable-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class PeriodicityResolvePagingParams implements Resolve<any> {
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

export const periodicityRoute: Routes = [
  {
    path: '',
    component: PeriodicityComponent,
    resolve: {
      pagingParams: PeriodicityResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.periodicity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: PeriodicityDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.periodicity.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const periodicityPopupRoute: Routes = [
  {
    path: 'compte-comptable-new',
    component: PeriodicityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.periodicity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'compte-comptable/:id/edit',
    component: PeriodicityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.periodicity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'compte-comptable/:id/delete',
    component: PeriodicityDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.periodicity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
