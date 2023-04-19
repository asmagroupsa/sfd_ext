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

import { TauxCommissionComponent } from './taux-commission.component';
import { TauxCommissionDetailComponent } from './taux-commission-detail.component';
import { TauxCommissionPopupComponent } from './taux-commission-dialog.component';
import { TauxCommissionDeletePopupComponent } from './taux-commission-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TauxCommissionResolvePagingParams implements Resolve<any> {
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

export const tauxCommissionRoute: Routes = [
  {
    path: '',
    component: TauxCommissionComponent,
    resolve: {
      pagingParams: TauxCommissionResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxCommission.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TauxCommissionDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxCommission.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const tauxCommissionPopupRoute: Routes = [
  {
    path: 'taux-commission-new',
    component: TauxCommissionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxCommission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'taux-commission/:id/edit',
    component: TauxCommissionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxCommission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'taux-commission/:id/delete',
    component: TauxCommissionDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tauxCommission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
