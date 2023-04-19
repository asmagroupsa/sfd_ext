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

import { ConditionAccesComponent } from './condition-acces.component';
import { ConditionAccesDetailComponent } from './condition-acces-detail.component';
import { ConditionAccesPopupComponent } from './condition-acces-dialog.component';
import { ConditionAccesDeletePopupComponent } from './condition-acces-delete-dialog.component';

@Injectable()
export class ConditionAccesResolvePagingParams implements Resolve<any> {
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

export const conditionAccesRoute: Routes = [
  {
    path: '',
    component: ConditionAccesComponent,
    resolve: {
      pagingParams: ConditionAccesResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionAcces.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: ConditionAccesDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionAcces.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const conditionAccesPopupRoute: Routes = [
  {
    path: 'condition-acces-new',
    component: ConditionAccesPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionAcces.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'condition-acces/:id/edit',
    component: ConditionAccesPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionAcces.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'condition-acces/:id/delete',
    component: ConditionAccesDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionAcces.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
