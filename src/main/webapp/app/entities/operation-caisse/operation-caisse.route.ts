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

import { OperationCaisseComponent } from './operation-caisse.component';
import { OperationCaisseDetailComponent } from './operation-caisse-detail.component';
import { OperationCaissePopupComponent } from './operation-caisse-dialog.component';
import { OperationCaisseDeletePopupComponent } from './operation-caisse-delete-dialog.component';

import { Principal } from '../../shared';

export const OperationCaisseRoute: Routes = [
  {
    path: '',
    component: OperationCaisseComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: OperationCaisseDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const OperationCaissePopupRoute: Routes = [
  {
    path: 'operation-caisse-new',
    component: OperationCaissePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-caisse/:id/edit',
    component: OperationCaissePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation-caisse/:id/delete',
    component: OperationCaisseDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.operationCaisse.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
