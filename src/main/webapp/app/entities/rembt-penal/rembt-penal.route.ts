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

import { RembtPenalComponent } from './rembt-penal.component';
import { RembtPenalDetailComponent } from './rembt-penal-detail.component';
import { RembtPenalPopupComponent } from './rembt-penal-dialog.component';
import { RembtPenalDeletePopupComponent } from './rembt-penal-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class RembtPenalResolvePagingParams implements Resolve<any> {
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

export const rembtPenalRoute: Routes = [
  {
    path: '',
    component: RembtPenalComponent,
    resolve: {
      pagingParams: RembtPenalResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenal.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: RembtPenalDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenal.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const rembtPenalPopupRoute: Routes = [
  {
    path: 'rembt-penal-new',
    component: RembtPenalPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenal.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'rembt-penal/:id/edit',
    component: RembtPenalPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenal.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'rembt-penal/:id/delete',
    component: RembtPenalDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembtPenal.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
