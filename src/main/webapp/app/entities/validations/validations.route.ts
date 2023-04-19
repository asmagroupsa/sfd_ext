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

import { UnityComponent } from './validations.component';
import { UnityDetailComponent } from './validations-detail.component';
import { UnityPopupComponent } from './validations-dialog.component';
import { UnityDeletePopupComponent } from './validations-delete-dialog.component';

import { Principal } from '../../shared';

export const unityRoute: Routes = [
  {
    path: '',
    component: UnityComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: UnityDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const unityPopupRoute: Routes = [
  {
    path: 'unity-new',
    component: UnityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'unity/:id/edit',
    component: UnityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'unity/:id/delete',
    component: UnityDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
