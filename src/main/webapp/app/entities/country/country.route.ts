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

import { CountryComponent } from './country.component';
import { CountryDetailComponent } from './country-detail.component';
import { CountryPopupComponent } from './country-dialog.component';
import { CountryDeletePopupComponent } from './country-delete-dialog.component';

import { Principal } from '../../shared';

export const countryRoute: Routes = [
  {
    path: '',
    component: CountryComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CountryDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.country.home.title'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const countryPopupRoute: Routes = [
  {
    path: 'country-new',
    component: CountryPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.country.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'country/:id/edit',
    component: CountryPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.country.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'country/:id/delete',
    component: CountryDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.country.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
