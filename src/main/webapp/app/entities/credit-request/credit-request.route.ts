import {Injectable} from '@angular/core';
import {EventBus} from '../../shared/model/functions';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Routes,
    CanActivate
} from '@angular/router';

import {UserRouteAccessService} from '../../shared';
import {JhiPaginationUtil} from 'ng-jhipster';

import {CreditRequestComponent} from './credit-request.component';
import {CreditRequestDetailComponent} from './credit-request-detail.component';
import {CreditRequestPopupComponent} from './credit-request-dialog.component';
import {CreditRequestDeletePopupComponent} from './credit-request-delete-dialog.component';
import {CreditRequestPrintComponent} from './credit-request-print.component';

import {Principal} from '../../shared';
import {CreditRequestMontantsPopupComponent} from './credit-request-montants.component';
import {CreditRequestPrintNewComponent} from './credit-request-print-new.component';
import { CreditRequestValiderRevolvingComponent } from './credit-request-valider-revolving.component';

@Injectable()
export class CreditRequestResolvePagingParams implements Resolve<any> {
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

export const creditRequestRoute: Routes = [
    {
        path: '',
        component: CreditRequestComponent,
        resolve: {
            pagingParams: CreditRequestResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/credit-requests/getAllCreditRequests'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id',
        component: CreditRequestDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id/print',
        component: CreditRequestPrintComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/print-new',
        component: CreditRequestPrintNewComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService],
    },
    {
        path: ':id/:ref/valider',
        component: CreditRequestValiderRevolvingComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService],
    },
    // ,
    //   {
    //       path: ':id/print',
    //       component: CreditRequestPrintComponent,
    //       data: {
    //           authorities: ['ROLE_USER'],
    //           pageTitle: 'sfdApp.creditRequest.home.title'
    //       },
    //       canActivate: [UserRouteAccessService]
    //   }
];

export const creditRequestPopupRoute: Routes = [
    {
        path: 'credit-request-new',
        component: CreditRequestPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/credit-requests/createCreditRequest'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'credit-request/:id/edit',
        component: CreditRequestPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/credit-requests/updateCreditRequest'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'credit-request-montant/:id/etapes',
        component: CreditRequestMontantsPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/credit-requests/getAllCreditRequests'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'credit-request/:id/delete',
        component: CreditRequestDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            ressources: ['carmesfnmservice/api/credit-requests/deleteCreditRequest'],
            pageTitle: 'sfdApp.creditRequest.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    // {
    //     path: 'valider-revolving/:id/:ref/valider',
    //     component: ValidationRevolvingPopupComponent,
    //     data: {
    //         authorities: ['ROLE_USER'],
    //         ressources: ['carmesfnmservice/api/credit-requests/createCreditRequest'],
    //         pageTitle: 'sfdApp.creditRequest.home.title'
    //     },
    //     canActivate: [UserRouteAccessService],
    //     outlet: 'popup'
    // },

];
