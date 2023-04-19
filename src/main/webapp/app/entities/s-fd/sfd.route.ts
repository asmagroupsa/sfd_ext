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

import { SFDComponent } from './sfd.component';
import { SFDDetailComponent } from './sfd-detail.component';
import { SFDPopupComponent } from './sfd-dialog.component';
import { SFDDeletePopupComponent } from './sfd-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class SFDResolvePagingParams implements Resolve<any> {
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

export const sFDRoute: Routes = [
  {
    path: '',
    component: SFDComponent,
    resolve: {
      pagingParams: SFDResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.sFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: SFDDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.sFD.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const sFDPopupRoute: Routes = [
  {
    path: 'sfd-new',
    component: SFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.sFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'sfd/:id/edit',
    component: SFDPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.sFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'sfd/:id/delete',
    component: SFDDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.sFD.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
