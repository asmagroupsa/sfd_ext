import { ClientAssuranceComponent } from './client-assurance.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { ActiverPrintSheetComponent } from './activer-print-sheet.component';
import { ClientConditionAccesSheetComponent } from './client-condition-acces-sheet.component';
import { ClientDeletePopupComponent } from './client-delete-dialog.component';
import { ClientDetailComponent } from './client-detail.component';
import { ClientPopupComponent } from './client-dialog.component';
import { ClientIndetificationSheetComponent } from './client-indetification-sheet.component';
import { ClientMembershipFormComponent } from './client-membership-form.component';
import { ClientReleveComponent } from './client-releve.component';
import { ClientComponent } from './client.component';
import { ClientPPComponent } from './clientpp.component';
import {ClientMembershipFormNewComponent} from './client-membership-form-new.component';
import { ClientMarchandSheetComponent } from './client-marchand-sheet.component';
import {ActeurCommissionSheetComponent} from './acteur-commission-sheet.component';
import {ListeAgentComponent} from "./liste-agent.component";
import {ListeAgentPDFComponent} from "./liste-agent-pdf.component";

@Injectable()
export class ClientResolvePagingParams implements Resolve<any> {
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

export const clientRoute: Routes = [
    {
        path: '',
        component: ClientComponent,
        resolve: {
            pagingParams: ClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/clients/getAllClients'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'liste-agent',
        component: ListeAgentComponent,
        resolve: {
            pagingParams: ClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            // ressources: ['carmesfnmservice/api/clients/getAllClients'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'liste-agent-pdf',
        component: ListeAgentPDFComponent,
        resolve: {
            pagingParams: ClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            // ressources: ['carmesfnmservice/api/clients/getAllClients'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':cpteCarmes/commission-acteur',
        component: ActeurCommissionSheetComponent,
        resolve: {
            pagingParams: ClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/clients/getAllClients'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'releve',
        component: ClientReleveComponent,
        resolve: {
            pagingParams: ClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/clients/getAllClients'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'assurance',
        component: ClientAssuranceComponent,
        resolve: {
            pagingParams: ClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/clients/getAllClients'],
            pageTitle: 'Assurance'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'marchands-print',
        component: ClientMarchandSheetComponent,
        resolve: {
            pagingParams: ClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/clients/getAllClients'],
            pageTitle: 'La liste des marchands'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'pp',
        component: ClientPPComponent,
        resolve: {
            pagingParams: ClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'activer-print-sheet',
        component: ActiverPrintSheetComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id',
        component: ClientDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService]
    },

    {
        path: ':id/report/indentification-sheet',
        component: ClientIndetificationSheetComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/report/condition-acces-sheet',
        component: ClientConditionAccesSheetComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'fiche condition accès'
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/membership-form',
        component: ClientMembershipFormComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/membership-form-new',
        component: ClientMembershipFormNewComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService],
    },
];

export const clientPopupRoute: Routes = [
    {
        path: 'client-new',
        component: ClientPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/clients/createClient'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'client/:id/edit',
        component: ClientPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/clients/updateClient'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'client/:id/delete',
        component: ClientDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/clients/deleteClient'],
            pageTitle: 'sfdApp.client.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
