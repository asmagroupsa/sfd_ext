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

import { FraisGestionAccordeComponent } from './frais-gestion-accorde.component';
import { FraisGestionAccordeDetailComponent } from './frais-gestion-accorde-detail.component';
import { FraisGestionAccordePopupComponent } from './frais-gestion-accorde-dialog.component';
import { FraisGestionAccordeDeletePopupComponent } from './frais-gestion-accorde-delete-dialog.component';

import { Principal } from '../../shared';

@Injectable()
export class FraisGestionAccordeResolvePagingParams implements Resolve<any> {
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

export const fraisGestionAccordeRoute: Routes = [
  {
    path: '',
    component: FraisGestionAccordeComponent,
    resolve: {
      pagingParams: FraisGestionAccordeResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestionAccorde.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: FraisGestionAccordeDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestionAccorde.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const fraisGestionAccordePopupRoute: Routes = [
  {
    path: 'frais-gestion-accorde-new',
    component: FraisGestionAccordePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestionAccorde.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'frais-gestion-accorde/:id/edit',
    component: FraisGestionAccordePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestionAccorde.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'frais-gestion-accorde/:id/delete',
    component: FraisGestionAccordeDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestionAccorde.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
