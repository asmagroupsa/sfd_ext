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

import { RembtPenalSFDComponent } from './rembt-penal-sfd.component';
import { RembtPenalSFDDetailComponent } from './rembt-penal-sfd-detail.component';
import { RembtPenalSFDPopupComponent } from './rembt-penal-sfd-dialog.component';
import { RembtPenalSFDDeletePopupComponent } from './rembt-penal-sfd-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class RembtPenalSFDResolvePagingParams implements Resolve<any> {
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

export const rembtPenalSFDRoute: Routes = [
  {
    path: '',
    component: RembtPenalSFDComponent,
    resolve: {
      pagingParams: RembtPenalSFDResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: RembtPenalSFDDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const rembtPenalSFDPopupRoute: Routes = [
  {
    path: 'rembt-penal-sfd-new',
    component: RembtPenalSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'rembt-penal-sfd/:id/edit',
    component: RembtPenalSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'rembt-penal-sfd/:id/delete',
    component: RembtPenalSFDDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenalSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
