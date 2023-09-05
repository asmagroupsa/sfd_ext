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

import { RemboursementSFDComponent } from './remboursement-sfd.component';
import { RemboursementSFDDetailComponent } from './remboursement-sfd-detail.component';
import { RemboursementSFDPopupComponent } from './remboursement-sfd-dialog.component';
import { RemboursementSFDDeletePopupComponent } from './remboursement-sfd-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class RemboursementSFDResolvePagingParams implements Resolve<any> {
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

export const remboursementSFDRoute: Routes = [
  {
    path: '',
    component: RemboursementSFDComponent,
    resolve: {
      pagingParams: RemboursementSFDResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.remboursementSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: RemboursementSFDDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.remboursementSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const remboursementSFDPopupRoute: Routes = [
  {
    path: 'remboursement-sfd-new',
    component: RemboursementSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.remboursementSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'remboursement-sfd/:id/edit',
    component: RemboursementSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.remboursementSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'remboursement-sfd/:id/delete',
    component: RemboursementSFDDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.remboursementSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
