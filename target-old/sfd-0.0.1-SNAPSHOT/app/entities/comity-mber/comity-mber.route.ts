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

import { ComityMberComponent } from './comity-mber.component';
import { ComityMberDetailComponent } from './comity-mber-detail.component';
import { ComityMberPopupComponent } from './comity-mber-dialog.component';
import { ComityMberDeletePopupComponent } from './comity-mber-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class ComityMberResolvePagingParams implements Resolve<any> {
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

export const comityMberRoute: Routes = [
  {
    path: '',
    component: ComityMberComponent,
    resolve: {
      pagingParams: ComityMberResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.comityMber.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: ComityMberDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.comityMber.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const comityMberPopupRoute: Routes = [
  {
    path: 'comity-mber-new',
    component: ComityMberPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.comityMber.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'comity-mber/:id/edit',
    component: ComityMberPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.comityMber.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'comity-mber/:id/delete',
    component: ComityMberDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.comityMber.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
