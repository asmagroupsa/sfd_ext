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

import { TranchePenalSFDComponent } from './tranche-penal-sfd.component';
import { TranchePenalSFDDetailComponent } from './tranche-penal-sfd-detail.component';
import { TranchePenalSFDPopupComponent } from './tranche-penal-sfd-dialog.component';
import { TranchePenalSFDDeletePopupComponent } from './tranche-penal-sfd-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TranchePenalSFDResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) { }

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

export const tranchePenalSFDRoute: Routes = [
  {
    path: '',
    component: TranchePenalSFDComponent,
    resolve: {
      pagingParams: TranchePenalSFDResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TranchePenalSFDDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const tranchePenalSFDPopupRoute: Routes = [
  {
    path: 'tranche-penal-sfd-new',
    component: TranchePenalSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'tranche-penal-sfd/:id/edit',
    component: TranchePenalSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'tranche-penal-sfd/:id/delete',
    component: TranchePenalSFDDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.tranchePenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
