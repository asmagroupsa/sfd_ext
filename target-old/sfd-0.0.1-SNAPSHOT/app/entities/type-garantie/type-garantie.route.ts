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

import { TypeGarantieComponent } from './type-garantie.component';
import { TypeGarantieDetailComponent } from './type-garantie-detail.component';
import { TypeGarantiePopupComponent } from './type-garantie-dialog.component';
import { TypeGarantieDeletePopupComponent } from './type-garantie-delete-dialog.component';

import { Principal } from '../../shared';

export const typeGarantieRoute: Routes = [
  {
    path: '',
    component: TypeGarantieComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeGarantie.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TypeGarantieDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeGarantie.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const typeGarantiePopupRoute: Routes = [
  {
    path: 'type-garantie-new',
    component: TypeGarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-garantie/:id/edit',
    component: TypeGarantiePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-garantie/:id/delete',
    component: TypeGarantieDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeGarantie.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
