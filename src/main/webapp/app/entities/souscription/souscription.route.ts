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

import { SouscriptionComponent } from './souscription.component';
import { SouscriptionDetailComponent } from './souscription-detail.component';
import { SouscriptionPopupComponent } from './souscription-dialog.component';
import { SouscriptionDeletePopupComponent } from './souscription-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class SouscriptionResolvePagingParams implements Resolve<any> {
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

export const souscriptionRoute: Routes = [
  {
    path: '',
    component: SouscriptionComponent,
    resolve: {
      pagingParams: SouscriptionResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.souscription.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: SouscriptionDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.souscription.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const souscriptionPopupRoute: Routes = [
  {
    path: 'souscription-new',
    component: SouscriptionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.souscription.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'bailleur',
    component: SouscriptionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.souscription.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },

  {
    path: 'sfd',
    component: SouscriptionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.souscription.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'souscription/:id/edit',
    component: SouscriptionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.souscription.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'souscription/:id/delete',
    component: SouscriptionDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.souscription.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
