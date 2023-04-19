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

import { CaisseNouvelleComponent } from './caisse-nouvelle.component';
import { CaisseNouvelleDetailComponent } from './caisse-nouvelle-detail.component';
import { CaisseNouvellePopupComponent } from './caisse-nouvelle-dialog.component';
import { CaisseNouvelleDeletePopupComponent } from './caisse-nouvelle-delete-dialog.component';

import { Principal } from '../../shared';
import { AlimentationCaissePopupComponent } from './alimentation-caisse-dialog.component';
import { AlimentationCaisseSfdPopupComponent } from './alimentation-caisse-sfd-dialog.component';
import { CaisseNouvelleDetailSoldeComponent } from './caisse-nouvelle-detail-solde.component';
import { CaisseNouvelleStatutPopupComponent } from './caisse-nouvelle-statut-dialog.component';

export const caisseNouvelleRoute: Routes = [
    {
        path: '',
        component: CaisseNouvelleComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id',
        component: CaisseNouvelleDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'solde/:id',
        component: CaisseNouvelleDetailSoldeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const caisseNouvellePopupRoute: Routes = [
    {
        path: 'alimentation-caisse-agence',
        component: AlimentationCaissePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'alimentation-caisse-sfd',
        component: AlimentationCaisseSfdPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'caisse-nouvelle-new',
        component: CaisseNouvellePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'caisse-nouvelle/:id/edit',
        component: CaisseNouvellePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'caisse-nouvelle/:id/etat',
        component: CaisseNouvelleStatutPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'caisse-nouvelle/:id/delete',
        component: CaisseNouvelleDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.caisseNouvelle.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
