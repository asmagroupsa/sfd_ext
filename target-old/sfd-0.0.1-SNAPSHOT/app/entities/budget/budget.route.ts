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

import { BudgetComponent } from './budget.component';
import { BudgetDetailComponent } from './budget-detail.component';
import { BudgetPopupComponent } from './budget-dialog.component';
import { BudgetDeletePopupComponent } from './budget-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class BudgetResolvePagingParams implements Resolve<any> {
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

export const budgetRoute: Routes = [
  {
    path: '',
    component: BudgetComponent,
    resolve: {
      pagingParams: BudgetResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.budget.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: BudgetDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.budget.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const budgetPopupRoute: Routes = [
  {
    path: 'budget-new',
    component: BudgetPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.budget.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'budget/:id/edit',
    component: BudgetPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.budget.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'budget/:id/delete',
    component: BudgetDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.budget.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
