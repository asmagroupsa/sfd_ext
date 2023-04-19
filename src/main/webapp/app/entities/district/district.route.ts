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

import { DistrictComponent } from './district.component';
import { DistrictDetailComponent } from './district-detail.component';
import { DistrictPopupComponent } from './district-dialog.component';
import { DistrictDeletePopupComponent } from './district-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class DistrictResolvePagingParams implements Resolve<any> {
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

export const districtRoute: Routes = [
  {
    path: '',
    component: DistrictComponent,
    resolve: {
      pagingParams: DistrictResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.district.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: DistrictDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.district.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const districtPopupRoute: Routes = [
  {
    path: 'district-new',
    component: DistrictPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.district.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'district/:id/edit',
    component: DistrictPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.district.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'district/:id/delete',
    component: DistrictDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.district.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
