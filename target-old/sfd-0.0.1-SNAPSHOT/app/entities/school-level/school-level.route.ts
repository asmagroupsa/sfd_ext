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

import { SchoolLevelComponent } from './school-level.component';
import { SchoolLevelDetailComponent } from './school-level-detail.component';
import { SchoolLevelPopupComponent } from './school-level-dialog.component';
import { SchoolLevelDeletePopupComponent } from './school-level-delete-dialog.component';

import { Principal } from '../../shared';

export const schoolLevelRoute: Routes = [
  {
    path: '',
    component: SchoolLevelComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.schoolLevel.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: SchoolLevelDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.schoolLevel.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const schoolLevelPopupRoute: Routes = [
  {
    path: 'school-level-new',
    component: SchoolLevelPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.schoolLevel.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'school-level/:id/edit',
    component: SchoolLevelPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.schoolLevel.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'school-level/:id/delete',
    component: SchoolLevelDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.schoolLevel.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
