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

import { OperationComptableComponent } from './operation-comptable.component';
import { OperationComptableDetailComponent } from './operation-comptable-detail.component';
import { OperationComptablePopupComponent } from './operation-comptable-dialog.component';
import { OperationComptableDeletePopupComponent } from './operation-comptable-delete-dialog.component';

@Injectable()
export class OperationComptableResolvePagingParams implements Resolve<any> {
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

export const operationComptableRoute: Routes = [
  {
    path: '',
    component: OperationComptableComponent,
    resolve: {
      pagingParams: OperationComptableResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationComptable.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: OperationComptableDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationComptable.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const operationComptablePopupRoute: Routes = [
  {
    path: 'operation-comptable-new',
    component: OperationComptablePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationComptable.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-comptable/:id/edit',
    component: OperationComptablePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationComptable.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-comptable/:id/delete',
    component: OperationComptableDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationComptable.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
