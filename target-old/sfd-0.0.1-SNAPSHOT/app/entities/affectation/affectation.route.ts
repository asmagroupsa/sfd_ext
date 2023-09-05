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

import { AffectationComponent } from './affectation.component';
import { AffectationDetailComponent } from './affectation-detail.component';
import { AffectationPopupComponent } from './affectation-dialog.component';
import { AffectationDeletePopupComponent } from './affectation-delete-dialog.component';

@Injectable()
export class AffectationResolvePagingParams implements Resolve<any> {
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

export const affectationRoute: Routes = [
  {
    path: '',
    component: AffectationComponent,
    resolve: {
      pagingParams: AffectationResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.affectation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: AffectationDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.affectation.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const affectationPopupRoute: Routes = [
  {
    path: 'affectation-new',
    component: AffectationPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.affectation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'affectation/:id/edit',
    component: AffectationPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.affectation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'affectation/:id/delete',
    component: AffectationDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.affectation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
