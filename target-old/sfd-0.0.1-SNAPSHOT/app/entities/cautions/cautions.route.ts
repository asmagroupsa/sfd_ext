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

import { AnneeComponent } from './cautions.component';
import { AnneeDetailComponent } from './cautions-detail.component';
import { AnneePopupComponent } from "./cautions-dialog.component";
import { AnneeDeletePopupComponent } from "./cautions-delete-dialog.component";

import { Principal } from '../../shared';

export const anneeRoute: Routes = [
  {
    path: '',
    component: AnneeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.annee.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: AnneeDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.annee.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const anneePopupRoute: Routes = [
  {
    path: 'cautions-new',
    component: AnneePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.annee.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'cautions/:id/edit',
    component: AnneePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.annee.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'cautions/:id/delete',
    component: AnneeDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.annee.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
