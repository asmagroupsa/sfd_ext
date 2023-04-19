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

import { IdCardTypeComponent } from './id-card-type.component';
import { IdCardTypeDetailComponent } from './id-card-type-detail.component';
import { IdCardTypePopupComponent } from './id-card-type-dialog.component';
import { IdCardTypeDeletePopupComponent } from './id-card-type-delete-dialog.component';

import { Principal } from '../../shared';

export const idCardTypeRoute: Routes = [
  {
    path: '',
    component: IdCardTypeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.idCardType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: IdCardTypeDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.idCardType.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const idCardTypePopupRoute: Routes = [
  {
    path: 'id-card-type-new',
    component: IdCardTypePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.idCardType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'id-card-type/:id/edit',
    component: IdCardTypePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.idCardType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'id-card-type/:id/delete',
    component: IdCardTypeDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.idCardType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
