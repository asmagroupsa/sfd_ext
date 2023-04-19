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

import { TypeClientComponent } from './type-client.component';
import { TypeClientDetailComponent } from './type-client-detail.component';
import { TypeClientPopupComponent } from './type-client-dialog.component';
import { TypeClientDeletePopupComponent } from './type-client-delete-dialog.component';

import { Principal } from '../../shared';

export const typeClientRoute: Routes = [
  {
    path: '',
    component: TypeClientComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeClient.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'frais/:id',
    component: TypeClientDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeClient.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const typeClientPopupRoute: Routes = [
  {
    path: 'type-client-new',
    component: TypeClientPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-client/:id/edit',
    component: TypeClientPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-client/:id/delete',
    component: TypeClientDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeClient.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
