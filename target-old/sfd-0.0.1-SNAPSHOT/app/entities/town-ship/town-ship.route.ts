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

import { TownShipComponent } from './town-ship.component';
import { TownShipDetailComponent } from './town-ship-detail.component';
import { TownShipPopupComponent } from './town-ship-dialog.component';
import { TownShipDeletePopupComponent } from './town-ship-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class TownShipResolvePagingParams implements Resolve<any> {
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

export const townShipRoute: Routes = [
  {
    path: '',
    component: TownShipComponent,
    resolve: {
      pagingParams: TownShipResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.townShip.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TownShipDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.townShip.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const townShipPopupRoute: Routes = [
  {
    path: 'town-ship-new',
    component: TownShipPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.townShip.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'town-ship/:id/edit',
    component: TownShipPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.townShip.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'town-ship/:id/delete',
    component: TownShipDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.townShip.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
