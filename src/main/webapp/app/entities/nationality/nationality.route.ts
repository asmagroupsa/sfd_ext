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

import { NationalityComponent } from './nationality.component';
import { NationalityDetailComponent } from './nationality-detail.component';
import { NationalityPopupComponent } from './nationality-dialog.component';
import { NationalityDeletePopupComponent } from './nationality-delete-dialog.component';

import { Principal } from '../../shared';

export const nationalityRoute: Routes = [
  {
    path: '',
    component: NationalityComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.nationality.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: NationalityDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.nationality.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const nationalityPopupRoute: Routes = [
  {
    path: 'nationality-new',
    component: NationalityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.nationality.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'nationality/:id/edit',
    component: NationalityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.nationality.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'nationality/:id/delete',
    component: NationalityDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.nationality.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
