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

import { CreditComponent } from './credit.component';
import { CreditDetailComponent } from './credit-detail.component';
import { CreditPopupComponent } from './credit-dialog.component';
import { CreditDeletePopupComponent } from './credit-delete-dialog.component';
import { CreditApprobationSheetComponent } from './credit-approbation-sheet.component';
import { CreditLoanAgreementComponent } from './credit-loan-agreement.component';
import { CreditFicheOrdreComponent } from './credit-fiche-ordre.component';
import { CreditContratTpeComponent } from './credit-fiche-contratTPE.component';
import { Principal } from '../../shared';
import { CreditEnCoursDialogComponent, CreditEnCoursPopupComponent } from './credit-en-cours-dialog.component';
import { CreditEnCoursComponent } from './credit-en-cours.component';
import { PenalitePrintSheetComponent} from './penalite-print-sheet.component';
import { CreditContratSolidaireComponent } from "./credit-fiche-contrat-solidaire.component"

import { CreditContratUsagerComponent} from './credit-fiche-contrat-usager.component';
import { CreditContratImmobilierComponent } from './credit-fiche-contrat-immobilier.component';

/* import { CreditContratMarchandComponent} from './credit-contrat-marchand'; */7
import { CreditContratEquipementComponent } from './credit-fiche-contrat-equipement.component'
import { CreditContratNumeriqueComponent} from './credit-fiche-contrat-numerique.component';
import { CreditContratMarchandComponent } from './credit-fiche-contrat-marchand.component'
import {ListeCreditsImpayesComponent} from './liste-credits-impayes.component';
import { CreditRetrancheComponent } from './credit-retranche.component';
import { ContratMCMComponent } from './contrat-mcm.component';
import { ContratSousTraitantComponent } from './contrat-sous-traitant.component';
import { CreditPerteComponent } from './type-credit-sfd/credit-perte.component';
import { CreditSouffranceComponent } from './type-credit-sfd/credit-souffrance.component';

@Injectable()
export class CreditResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) { }

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

export const creditRoute: Routes = [
  {
    path: 'operation/:id',
    component: CreditComponent,
    resolve: {
      pagingParams: CreditResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      ressources:['carmesfnmservice/api/credits/getAllCredits'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'credit-en-perte',
    component: CreditPerteComponent,
    resolve: {
      pagingParams: CreditResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'credit-en-souffrance',
    component: CreditSouffranceComponent,
    resolve: {
      pagingParams: CreditResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'credit-en-cours',
    component: CreditEnCoursComponent,
    resolve: {
      pagingParams: CreditResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'penalite-print-sheet',
    component: PenalitePrintSheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },

  {
    path: 'liste-credits-impayes',
    component: ListeCreditsImpayesComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: ':id',
    component: CreditDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/report/credit-approbation-sheet',
    component: CreditApprobationSheetComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/credit-tpe-print',
    component: CreditContratTpeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/credit-numerique-print-sheet',
    component: CreditContratNumeriqueComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/credit-solidaire-print-sheet',
    component: CreditContratSolidaireComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: ':id/credit-contrat-caution-marchand-print',
    component: CreditContratMarchandComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/credit-contrat-usager-print-sheet',
    component: CreditContratUsagerComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: ':id/credit-contrat-immobilier-print-sheet',
    component: CreditContratImmobilierComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: ':id/credit-contrat-equipement-print',
    component: CreditContratEquipementComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: ':id/loan-agreement',
    component: CreditLoanAgreementComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/contrat-mcm',
    component: ContratMCMComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/contrat-sous-traitant',
    component: ContratSousTraitantComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/fiche-payement-order',
    component: CreditFicheOrdreComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/retranche-credit',
    component: CreditRetrancheComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.credit.home.title'
    },
    canActivate: [UserRouteAccessService],
  },


];

export const creditPopupRoute: Routes = [
  {
    path: 'operation/credit-new',
    component: CreditPopupComponent,
    data: {
      authorities: ['ROLE_USER'],
    ressources:['carmesfnmservice/api/credits/getAllCredits'],
     pageTitle: 'sfdApp.credit.home.title'
      },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'payer/:id/:penaliterestant/penalite',
    component: CreditEnCoursPopupComponent,
    data: { authorities: ['ROLE_USER'], pageTitle: 'sfdApp.credit.home.title' },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation/credit/:id/edit',
    component: CreditPopupComponent,
    data: { authorities: ['ROLE_USER'], pageTitle: 'sfdApp.credit.home.title' },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'operation/credit/:id/delete',
    component: CreditDeletePopupComponent,
    data: { authorities: ['ROLE_USER'], pageTitle: 'sfdApp.credit.home.title' },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
