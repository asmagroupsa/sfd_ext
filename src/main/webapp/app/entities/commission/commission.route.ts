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

import { CommissionComponent } from './commission.component';
import { CommissionDetailComponent } from './commission-detail.component';
import { CommissionPopupComponent } from './commission-dialog.component';
import { CommissionDeletePopupComponent } from './commission-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class CommissionResolvePagingParams implements Resolve<any> {
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

export const commissionRoute: Routes = [
  {
    path: '',
    component: CommissionComponent,
    resolve: {
      pagingParams: CommissionResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.commission.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CommissionDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.commission.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const commissionPopupRoute: Routes = [
  {
    path: 'commission-new',
    component: CommissionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.commission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'commission/:id/edit',
    component: CommissionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.commission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'commission/:id/delete',
    component: CommissionDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.commission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
