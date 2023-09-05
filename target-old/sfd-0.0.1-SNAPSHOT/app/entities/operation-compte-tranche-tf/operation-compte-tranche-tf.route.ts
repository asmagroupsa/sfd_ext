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

import { OperationCompteTrancheTFComponent } from './operation-compte-tranche-tf.component';
import { OperationCompteTrancheTFDetailComponent } from './operation-compte-tranche-tf-detail.component';
import { OperationCompteTrancheTFPopupComponent } from './operation-compte-tranche-tf-dialog.component';
import { OperationCompteTrancheTFDeletePopupComponent } from './operation-compte-tranche-tf-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class OperationCompteTrancheTFResolvePagingParams
  implements Resolve<any> {
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

export const operationCompteTrancheTFRoute: Routes = [
  {
    path: '',
    component: OperationCompteTrancheTFComponent,
    resolve: {
      pagingParams: OperationCompteTrancheTFResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCompteTrancheTF.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: OperationCompteTrancheTFDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCompteTrancheTF.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const operationCompteTrancheTFPopupRoute: Routes = [
  {
    path: 'operation-compte-tranche-tf-new',
    component: OperationCompteTrancheTFPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCompteTrancheTF.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-compte-tranche-tf/:id/edit',
    component: OperationCompteTrancheTFPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCompteTrancheTF.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-compte-tranche-tf/:id/delete',
    component: OperationCompteTrancheTFDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCompteTrancheTF.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
