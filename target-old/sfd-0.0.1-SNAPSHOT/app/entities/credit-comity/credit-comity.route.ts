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

import { CreditComityComponent } from './credit-comity.component';
import { CreditComityDetailComponent } from './credit-comity-detail.component';
import { CreditComityPopupComponent } from './credit-comity-dialog.component';
import { CreditComityDeletePopupComponent } from './credit-comity-delete-dialog.component';

import { Principal } from '../../shared';
import { CreditComityMemberPopupComponent } from './credit-comity-member-dialog.component';
import { CreditComityCloturePopupComponent } from './credit-comity-cloture-dialog.component';
import {CreditCommityDossiersComponent} from './credit-commity-dossiers.component'
import {CreditCommityFicheDossiersComponent } from './credit-comity-fiche-dossiers.component'
import {CreditCommityFicheDossiersComityMemberComponent} from './credit-comity-fiche-dossiers-comity-member.component'
import { CreditComityDossierDeletePopupComponent } from './credit-comity-dossier-delete-dialog.component';
import { FicheDossiersComityComponent } from './fiche-dossiers-comity-print.component';
import {PVPreComiteComponent} from "./pv-pre-comite.component";

@Injectable()
export class CreditComityResolvePagingParams implements Resolve<any> {
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

export const creditComityRoute: Routes = [
  {
    path: '',
    component: CreditComityComponent,
    resolve: {
      pagingParams: CreditComityResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/credit-comities/getAllCreditComities'],
      pageTitle: 'sfdApp.creditComity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: CreditComityDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditComity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/pv-commity-dossier',
    component: PVPreComiteComponent,
    // component: FicheDossiersComityComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditComity.home.title'
    },
    canActivate: [UserRouteAccessService]
  },

  
  {
      path: ':id/commity-dossiers',
      component:  CreditCommityDossiersComponent,
      data: {
          authorities: ['ROLE_USER'],
          pageTitle: 'sfdApp.creditComityDossiers.home.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/commity-dossiers/:id/fiche',
      component:  CreditCommityFicheDossiersComponent,
      data: {
          authorities: ['ROLE_USER'],
          pageTitle: 'sfdApp.creditComityFicheDossiers.home.title'
      },
      canActivate: [UserRouteAccessService]
  },
  {
      path: ':id/commity-dossiers/:id/fiche-member',
      component:  CreditCommityFicheDossiersComityMemberComponent,
      data: {
          authorities: ['ROLE_USER'],
          pageTitle: 'sfdApp.creditComityFicheDossiersComityMember.home.title'
      },
      canActivate: [UserRouteAccessService]
  }
];

export const creditComityPopupRoute: Routes = [
  {
    path: 'credit-comity/:id/member',
    component: CreditComityMemberPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditComity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'credit-comity/:id/cloture',
    component: CreditComityCloturePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditComity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },

  {
    path: 'credit-comity/:id/commity-dossiers/:dossier/delete',
    component: CreditComityDossierDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.creditComityDossiers.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'credit-comity-new',
    component: CreditComityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/credit-comities/createCreditComity'],
      pageTitle: 'sfdApp.creditComity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'credit-comity/:id/edit',
    component: CreditComityPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/credit-comities/updateCreditComity'],
      pageTitle: 'sfdApp.creditComity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'credit-comity/:id/delete',
    component: CreditComityDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/credit-comities/deleteCreditComity'],
      pageTitle: 'sfdApp.creditComity.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  // {
  //     path: ':id/commity-dossiers/:id/fiche',
  //     component:  CreditCommityFicheDossiersComponent,
  //     data: {
  //         authorities: ['ROLE_USER'],
  //         pageTitle: 'sfdApp.creditComityFicheDossiers.home.title'
  //     },
  //     canActivate: [UserRouteAccessService],
  //     outlet: 'printpopup'
  // },
  // {
  //     path: ':id/commity-dossiers/:id/fiche-member',
  //     component:  CreditCommityFicheDossiersComityMemberComponent,
  //     data: {
  //         authorities: ['ROLE_USER'],
  //         pageTitle: 'sfdApp.creditComityFicheDossiersComityMember.home.title'
  //     },
  //     canActivate: [UserRouteAccessService],
  //     outlet: 'printpopup'
  // }
];
