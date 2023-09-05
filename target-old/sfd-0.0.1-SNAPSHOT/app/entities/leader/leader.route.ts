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

import { LeaderComponent } from './leader.component';
import { LeaderDetailComponent } from './leader-detail.component';
import { LeaderPopupComponent } from './leader-dialog.component';
import { LeaderDeletePopupComponent } from './leader-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class LeaderResolvePagingParams implements Resolve<any> {
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

export const leaderRoute: Routes = [
  {
    path: '',
    component: LeaderComponent,
    resolve: {
      pagingParams: LeaderResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.leader.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: LeaderDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.leader.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const leaderPopupRoute: Routes = [
  {
    path: 'leader-new',
    component: LeaderPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.leader.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'leader/:id/edit',
    component: LeaderPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.leader.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'leader/:id/delete',
    component: LeaderDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.leader.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
