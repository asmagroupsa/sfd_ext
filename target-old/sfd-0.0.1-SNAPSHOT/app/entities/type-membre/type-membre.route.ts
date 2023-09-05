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

import { TypeMembreComponent } from './type-membre.component';
import { TypeMembreDetailComponent } from './type-membre-detail.component';
import { TypeMembrePopupComponent } from './type-membre-dialog.component';
import { TypeMembreDeletePopupComponent } from './type-membre-delete-dialog.component';

import { Principal } from '../../shared';

export const typeMembreRoute: Routes = [
  {
    path: '',
    component: TypeMembreComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeMembre.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: TypeMembreDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeMembre.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const typeMembrePopupRoute: Routes = [
  {
    path: 'type-membre-new',
    component: TypeMembrePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeMembre.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-membre/:id/edit',
    component: TypeMembrePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeMembre.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'type-membre/:id/delete',
    component: TypeMembreDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.typeMembre.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
