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

import { CompensationTypeComponent } from './compensation-type.component';
import { CompensationTypeDetailComponent } from './compensation-type-detail.component';
import { CompensationTypePopupComponent } from './compensation-type-dialog.component';
import { CompensationTypeDeletePopupComponent } from './compensation-type-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class CompensationTypeResolvePagingParams implements Resolve<any> {
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

export const compensationTypeRoute: Routes = [
  {
    path: '',
    component: CompensationTypeComponent,
    resolve: {
      pagingParams: CompensationTypeResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensationType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CompensationTypeDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensationType.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const compensationTypePopupRoute: Routes = [
  {
    path: 'compensation-type-new',
    component: CompensationTypePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensationType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'compensation-type/:id/edit',
    component: CompensationTypePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensationType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'compensation-type/:id/delete',
    component: CompensationTypeDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.compensationType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
