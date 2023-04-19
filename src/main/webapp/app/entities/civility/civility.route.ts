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

import { CivilityComponent } from './civility.component';
import { CivilityDetailComponent } from './civility-detail.component';
import { CivilityPopupComponent } from './civility-dialog.component';
import { CivilityDeletePopupComponent } from './civility-delete-dialog.component';

import { Principal } from '../../shared';

export const civilityRoute: Routes = [
  {
    path: '',
    component: CivilityComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.civility.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CivilityDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.civility.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const civilityPopupRoute: Routes = [
  {
    path: 'civility-new',
    component: CivilityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.civility.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'civility/:id/edit',
    component: CivilityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.civility.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'civility/:id/delete',
    component: CivilityDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.civility.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
