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

import { CityComponent } from './city.component';
import { CityDetailComponent } from './city-detail.component';
import { CityPopupComponent } from './city-dialog.component';
import { CityDeletePopupComponent } from './city-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class CityResolvePagingParams implements Resolve<any> {
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

export const cityRoute: Routes = [
  {
    path: '',
    component: CityComponent,
    resolve: {
      pagingParams: CityResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.city.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CityDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.city.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const cityPopupRoute: Routes = [
  {
    path: 'city-new',
    component: CityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.city.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'city/:id/edit',
    component: CityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.city.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'city/:id/delete',
    component: CityDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.city.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
