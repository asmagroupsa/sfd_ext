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

import { AgenceComponent } from './agence.component';
import { AgenceDetailComponent } from './agence-detail.component';
import { AgencePopupComponent } from './agence-dialog.component';
import { AgenceDeletePopupComponent } from './agence-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class AgenceResolvePagingParams implements Resolve<any> {
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

export const agenceRoute: Routes = [
  {
    path: '',
    component: AgenceComponent,
    resolve: {
      pagingParams: AgenceResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.agence.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: AgenceDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.agence.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const agencePopupRoute: Routes = [
  {
    path: 'agence-new',
    component: AgencePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.agence.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'agence/:id/edit',
    component: AgencePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.agence.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'agence/:id/delete',
    component: AgenceDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.agence.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
