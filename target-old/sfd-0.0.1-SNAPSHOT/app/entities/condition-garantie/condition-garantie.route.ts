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

import { ConditionGarantieComponent } from './condition-garantie.component';
import { ConditionGarantieDetailComponent } from './condition-garantie-detail.component';
import { ConditionGarantiePopupComponent } from './condition-garantie-dialog.component';
import { ConditionGarantieDeletePopupComponent } from './condition-garantie-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class ConditionGarantieResolvePagingParams implements Resolve<any> {
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

export const conditionGarantieRoute: Routes = [
  {
    path: '',
    component: ConditionGarantieComponent,
    resolve: {
      pagingParams: ConditionGarantieResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionGarantie.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: ConditionGarantieDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionGarantie.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const conditionGarantiePopupRoute: Routes = [
  {
    path: 'condition-garantie-new',
    component: ConditionGarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'condition-garantie/:id/edit',
    component: ConditionGarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'condition-garantie/:id/delete',
    component: ConditionGarantieDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.conditionGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
