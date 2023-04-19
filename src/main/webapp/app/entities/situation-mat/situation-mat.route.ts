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

import { SituationMatComponent } from './situation-mat.component';
import { SituationMatDetailComponent } from './situation-mat-detail.component';
import { SituationMatPopupComponent } from './situation-mat-dialog.component';
import { SituationMatDeletePopupComponent } from './situation-mat-delete-dialog.component';

import { Principal } from '../../shared';

export const situationMatRoute: Routes = [
  {
    path: '',
    component: SituationMatComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.situationMat.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: SituationMatDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.situationMat.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const situationMatPopupRoute: Routes = [
  {
    path: 'situation-mat-new',
    component: SituationMatPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.situationMat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'situation-mat/:id/edit',
    component: SituationMatPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.situationMat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'situation-mat/:id/delete',
    component: SituationMatDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.situationMat.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
