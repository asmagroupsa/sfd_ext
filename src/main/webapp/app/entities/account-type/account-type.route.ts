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

import { AccountTypeComponent } from './account-type.component';
import { AccountTypeDetailComponent } from './account-type-detail.component';
import { AccountTypePopupComponent } from './account-type-dialog.component';
import { AccountTypeDeletePopupComponent } from './account-type-delete-dialog.component';

import { Principal } from '../../shared';

export const accountTypeRoute: Routes = [
  {
    path: '',
    component: AccountTypeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.accountType.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: AccountTypeDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.accountType.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const accountTypePopupRoute: Routes = [
  {
    path: 'account-type-new',
    component: AccountTypePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.accountType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'account-type/:id/edit',
    component: AccountTypePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.accountType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'account-type/:id/delete',
    component: AccountTypeDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.accountType.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
