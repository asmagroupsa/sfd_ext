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

import { OperationTypeComponent } from './operation-type.component';
import { OperationTypeDetailComponent } from './operation-type-detail.component';
import { OperationTypePopupComponent } from './operation-type-dialog.component';
import { OperationTypeDeletePopupComponent } from './operation-type-delete-dialog.component';

import { Principal } from '../../shared';

export const operationTypeRoute: Routes = [
  {
    path: '',
    component: OperationTypeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: OperationTypeDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationType.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const operationTypePopupRoute: Routes = [
  {
    path: 'operation-type-new',
    component: OperationTypePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-type/:id/edit',
    component: OperationTypePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-type/:id/delete',
    component: OperationTypeDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
