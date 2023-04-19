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

import { PenalityComponent } from './penality.component';
import { TranchePenalDetailComponent } from './tranche-penal-detail.component';
import { PenalityPopupComponent } from './penality-dialog.component';
import { TranchePenalDeletePopupComponent } from './tranche-penal-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TranchePenalResolvePagingParams implements Resolve<any> {
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

export const tranchePenalRoute: Routes = [
  {
    path: '',
    component: PenalityComponent,
    resolve: {
      pagingParams: TranchePenalResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenal.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TranchePenalDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenal.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const tranchePenalPopupRoute: Routes = [
  {
    path: 'penality-new',
    component: PenalityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenal.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'penality/:id/edit',
    component: PenalityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenal.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'penality/:id/delete',
    component: TranchePenalDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenal.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
