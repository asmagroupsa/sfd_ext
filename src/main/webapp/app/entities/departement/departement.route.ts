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

import { DepartementComponent } from './departement.component';
import { DepartementDetailComponent } from './departement-detail.component';
import { DepartementPopupComponent } from './departement-dialog.component';
import { DepartementDeletePopupComponent } from './departement-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class DepartementResolvePagingParams implements Resolve<any> {
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

export const departementRoute: Routes = [
  {
    path: '',
    component: DepartementComponent,
    resolve: {
      pagingParams: DepartementResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.departement.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: DepartementDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.departement.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const departementPopupRoute: Routes = [
  {
    path: 'departement-new',
    component: DepartementPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.departement.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'departement/:id/edit',
    component: DepartementPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.departement.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'departement/:id/delete',
    component: DepartementDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.departement.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
