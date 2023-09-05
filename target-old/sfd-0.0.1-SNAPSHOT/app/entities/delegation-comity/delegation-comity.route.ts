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

import { DelegationComityComponent } from './delegation-comity.component';
import { DelegationComityDetailComponent } from './delegation-comity-detail.component';
import { DelegationComityPopupComponent } from './delegation-comity-dialog.component';
import { DelegationComityDeletePopupComponent } from './delegation-comity-delete-dialog.component';

@Injectable()
export class DelegationComityResolvePagingParams implements Resolve<any> {
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

export const delegationComityRoute: Routes = [
  {
    path: '',
    component: DelegationComityComponent,
    resolve: {
      pagingParams: DelegationComityResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegationComity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: DelegationComityDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegationComity.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const delegationComityPopupRoute: Routes = [
  {
    path: 'delegation-comity-new',
    component: DelegationComityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegationComity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'delegation-comity/:id/edit',
    component: DelegationComityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegationComity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'delegation-comity/:id/delete',
    component: DelegationComityDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.delegationComity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
