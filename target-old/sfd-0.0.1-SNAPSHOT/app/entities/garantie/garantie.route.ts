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

import { GarantieComponent } from './garantie.component';
import { GarantieDetailComponent } from './garantie-detail.component';
import { GarantiePopupComponent } from './garantie-dialog.component';
import { GarantieDeletePopupComponent } from './garantie-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class GarantieResolvePagingParams implements Resolve<any> {
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

export const garantieRoute: Routes = [
  {
    path: '',
    component: GarantieComponent,
    resolve: {
      pagingParams: GarantieResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.garantie.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: GarantieDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.garantie.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const garantiePopupRoute: Routes = [
  {
    path: 'garantie-new',
    component: GarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.garantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'garantie/:id/edit',
    component: GarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.garantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'garantie/:id/delete',
    component: GarantieDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.garantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
