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

import { EligibleComponent } from './eligible.component';
import { EligibleDetailComponent } from './eligible-detail.component';
import { EligiblePopupComponent } from './eligible-dialog.component';
import { EligibleDeletePopupComponent } from './eligible-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class EligibleResolvePagingParams implements Resolve<any> {
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

export const eligibleRoute: Routes = [
  {
    path: '',
    component: EligibleComponent,
    resolve: {
      pagingParams: EligibleResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.eligible.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: EligibleDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.eligible.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const eligiblePopupRoute: Routes = [
  {
    path: 'eligible-new',
    component: EligiblePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.eligible.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'eligible/:id/edit',
    component: EligiblePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.eligible.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'eligible/:id/delete',
    component: EligibleDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.eligible.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
