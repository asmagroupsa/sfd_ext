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

import { TypeCreditRetardComponent } from './type-credit-retard.component';
import { TypeCreditRetardDetailComponent } from './type-credit-retard-detail.component';
import { TypeCreditRetardPopupComponent } from './type-credit-retard-dialog.component';
import { TypeCreditRetardDeletePopupComponent } from './type-credit-retard-delete-dialog.component';

import { Principal } from '../../shared';

export const typeCreditRetardRoute: Routes = [
  {
    path: '',
    component: TypeCreditRetardComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCreditRetard.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TypeCreditRetardDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCreditRetard.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const typeCreditRetardPopupRoute: Routes = [
  {
    path: 'type-credit-retard-new',
    component: TypeCreditRetardPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCreditRetard.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-credit-retard/:id/edit',
    component: TypeCreditRetardPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCreditRetard.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-credit-retard/:id/delete',
    component: TypeCreditRetardDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeCreditRetard.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
