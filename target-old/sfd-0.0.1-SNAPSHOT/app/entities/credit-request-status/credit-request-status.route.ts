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

import { CreditRequestStatusComponent } from './credit-request-status.component';
import { CreditRequestStatusDetailComponent } from './credit-request-status-detail.component';
import { CreditRequestStatusPopupComponent } from './credit-request-status-dialog.component';
import { CreditRequestStatusDeletePopupComponent } from './credit-request-status-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class CreditRequestStatusResolvePagingParams implements Resolve<any> {
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

export const creditRequestStatusRoute: Routes = [
  {
    path: '',
    component: CreditRequestStatusComponent,
    resolve: {
      pagingParams: CreditRequestStatusResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditRequestStatus.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CreditRequestStatusDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditRequestStatus.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const creditRequestStatusPopupRoute: Routes = [
  {
    path: 'credit-request-status-new',
    component: CreditRequestStatusPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditRequestStatus.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'credit-request-status/:id/edit',
    component: CreditRequestStatusPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditRequestStatus.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'credit-request-status/:id/delete',
    component: CreditRequestStatusDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditRequestStatus.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
