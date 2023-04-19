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

import { FraisGestionComponent } from './frais-gestion.component';
import { FraisGestionDetailComponent } from './frais-gestion-detail.component';
import { FraisGestionPopupComponent } from './frais-gestion-dialog.component';
import { FraisGestionDeletePopupComponent } from './frais-gestion-delete-dialog.component';

import { Principal } from '../../shared';

export const fraisGestionRoute: Routes = [
  {
    path: '',
    component: FraisGestionComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestion.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: FraisGestionDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestion.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const fraisGestionPopupRoute: Routes = [
  {
    path: 'frais-gestion-new',
    component: FraisGestionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestion.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'frais-gestion/:id/edit',
    component: FraisGestionPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestion.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'frais-gestion/:id/delete',
    component: FraisGestionDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.fraisGestion.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
