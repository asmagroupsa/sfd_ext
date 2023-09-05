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

import { CompteCommissionComponent } from './compte-commission.component';
import { CompteCommissionDetailComponent } from './compte-commission-detail.component';
import { CompteCommissionPopupComponent } from './compte-commission-dialog.component';
import { CompteCommissionDeletePopupComponent } from './compte-commission-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class CompteCommissionResolvePagingParams implements Resolve<any> {
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

export const compteCommissionRoute: Routes = [
  {
    path: '',
    component: CompteCommissionComponent,
    resolve: {
      pagingParams: CompteCommissionResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compteCommission.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CompteCommissionDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compteCommission.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const compteCommissionPopupRoute: Routes = [
  {
    path: 'compte-commission-new',
    component: CompteCommissionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compteCommission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'compte-commission/:id/edit',
    component: CompteCommissionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compteCommission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'compte-commission/:id/delete',
    component: CompteCommissionDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compteCommission.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
