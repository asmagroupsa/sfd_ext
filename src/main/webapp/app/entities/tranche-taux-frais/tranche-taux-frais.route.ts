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

import { TrancheTauxFraisComponent } from './tranche-taux-frais.component';
import { TrancheTauxFraisDetailComponent } from './tranche-taux-frais-detail.component';
import { TrancheTauxFraisPopupComponent } from './tranche-taux-frais-dialog.component';
import { TrancheTauxFraisDeletePopupComponent } from './tranche-taux-frais-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TrancheTauxFraisResolvePagingParams implements Resolve<any> {
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

export const trancheTauxFraisRoute: Routes = [
  {
    path: '',
    component: TrancheTauxFraisComponent,
    resolve: {
      pagingParams: TrancheTauxFraisResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.trancheTauxFrais.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TrancheTauxFraisDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.trancheTauxFrais.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const trancheTauxFraisPopupRoute: Routes = [
  {
    path: 'tranche-taux-frais-new',
    component: TrancheTauxFraisPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.trancheTauxFrais.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'tranche-taux-frais/:id/edit',
    component: TrancheTauxFraisPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.trancheTauxFrais.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'tranche-taux-frais/:id/delete',
    component: TrancheTauxFraisDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.trancheTauxFrais.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
