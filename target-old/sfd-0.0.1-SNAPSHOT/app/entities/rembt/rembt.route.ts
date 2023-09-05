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

import { RembtComponent } from './rembt.component';
import { RembtDetailComponent } from './rembt-detail.component';
import { RembtPopupComponent } from './rembt-dialog.component';
import { RembtDeletePopupComponent } from './rembt-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class RembtResolvePagingParams implements Resolve<any> {
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

export const rembtRoute: Routes = [
  {
    path: '',
    component: RembtComponent,
    resolve: {
      pagingParams: RembtResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembt.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: RembtDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembt.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const rembtPopupRoute: Routes = [
  {
    path: 'rembt-new',
    component: RembtPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembt.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'rembt/:id/edit',
    component: RembtPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembt.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'rembt/:id/delete',
    component: RembtDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.rembt.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
