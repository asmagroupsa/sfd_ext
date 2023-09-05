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

import { LiteracyComponent } from './literacy.component';
import { LiteracyDetailComponent } from './literacy-detail.component';
import { LiteracyPopupComponent } from './literacy-dialog.component';
import { LiteracyDeletePopupComponent } from './literacy-delete-dialog.component';

import { Principal } from '../../shared';

export const literacyRoute: Routes = [
  {
    path: '',
    component: LiteracyComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.literacy.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: LiteracyDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.literacy.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const literacyPopupRoute: Routes = [
  {
    path: 'literacy-new',
    component: LiteracyPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.literacy.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'literacy/:id/edit',
    component: LiteracyPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.literacy.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'literacy/:id/delete',
    component: LiteracyDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.literacy.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
