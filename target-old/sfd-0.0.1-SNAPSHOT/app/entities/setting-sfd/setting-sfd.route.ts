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

import { SettingSFDComponent } from './setting-sfd.component';
import { SettingSFDDetailComponent } from './setting-sfd-detail.component';
import { SettingSFDPopupComponent } from './setting-sfd-dialog.component';
import { SettingSFDDeletePopupComponent } from './setting-sfd-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class SettingSFDResolvePagingParams implements Resolve<any> {
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

export const settingSFDRoute: Routes = [
  {
    path: '',
    component: SettingSFDComponent,
    resolve: {
      pagingParams: SettingSFDResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.settingSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: SettingSFDDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.settingSFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const settingSFDPopupRoute: Routes = [
  {
    path: 'setting-sfd-new',
    component: SettingSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.settingSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'setting-sfd/:id/edit',
    component: SettingSFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.settingSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'setting-sfd/:id/delete',
    component: SettingSFDDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.settingSFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
