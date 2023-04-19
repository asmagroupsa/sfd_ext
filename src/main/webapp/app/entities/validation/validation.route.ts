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

import { ValidationComponent } from './validation.component';
import { ValidationDetailComponent } from './validation-detail.component';
import { ValidationPopupComponent } from './validation-dialog.component';
import { ValidationDeletePopupComponent } from './validation-delete-dialog.component';
import {FicheDossiersComponent} from './fiche-dossiers.component';
import {FicheDossiersComityMemberComponent} from './fiche-dossiers-comity-member.component'
import { FichePvComponent } from './fiche-proces-verbal-comite.component';

@Injectable()
export class ValidationResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
    const sort = route.queryParams['sort']
      ? route.queryParams['sort']
      : 'id,asc';
    return {
      page: this.paginationUtil.parsePage(page),
      predicate: this.paginationUtil.parsePredicate(sort),
      ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const validationRoute: Routes = [
  {
    path: '',
    component: ValidationComponent,
    resolve: {
      pagingParams: ValidationResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/validations/getAllValidations'],
      pageTitle: 'sfdApp.validation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: ValidationDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.validation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/proces-verbal-comite',
    component: FichePvComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.validation.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/fiche-dossier',
    component: FicheDossiersComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.validationFicheDossiers.home.title'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/fiche-member',
    component: FicheDossiersComityMemberComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.validationFicheDossiersComityMember.home.title'
    },
    canActivate: [UserRouteAccessService],
  }
];

export const validationPopupRoute: Routes = [
  {
    path: 'validation-new',
    component: ValidationPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/validations/createValidation'],
      pageTitle: 'sfdApp.validation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'validation/:id/edit',
    component: ValidationPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.validation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'validation/:id/delete',
    component: ValidationDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.validation.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
