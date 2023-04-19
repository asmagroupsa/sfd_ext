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

import { CreditMenuComponent } from './credit-menu.component';
import { CreditMenuDetailComponent } from './credit-menu-detail.component';
import { CreditMenuPopupComponent } from './credit-menu-dialog.component';
import { CreditMenuDeletePopupComponent } from './credit-menu-delete-dialog.component';

import { Principal } from '../../shared';

export const CreditMenuRoute: Routes = [
  {
    path: ':id',
    component: CreditMenuComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const CreditMenuPopupRoute: Routes = [
  {
    path: 'credit-menu-new',
    component: CreditMenuPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'credit-menu/:id/edit',
    component: CreditMenuPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'credit-menu/:id/delete',
    component: CreditMenuDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.unity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
