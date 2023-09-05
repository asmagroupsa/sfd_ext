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

import { ConditionsComponent } from './conditions.component';
import { ConditionsDetailComponent } from './conditions-detail.component';
import { ConditionsPopupComponent } from './conditions-dialog.component';
import { ConditionsDeletePopupComponent } from './conditions-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class ConditionsResolvePagingParams implements Resolve<any> {
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

export const conditionsRoute: Routes = [
  {
    path: '',
    component: ConditionsComponent,
    resolve: {
      pagingParams: ConditionsResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditions.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: ConditionsDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditions.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const conditionsPopupRoute: Routes = [
  {
    path: 'conditions-new',
    component: ConditionsPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditions.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'conditions/:id/edit',
    component: ConditionsPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditions.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'conditions/:id/delete',
    component: ConditionsDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditions.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
