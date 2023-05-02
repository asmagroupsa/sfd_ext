import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';

import { CaisseNouvelleComponent } from './caisse-nouvelle.component';
import { CaisseNouvelleDetailComponent } from './caisse-nouvelle-detail.component';
import { CaisseNouvellePopupComponent } from './caisse-nouvelle-dialog.component';
import { CaisseNouvelleDeletePopupComponent } from './caisse-nouvelle-delete-dialog.component';

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
