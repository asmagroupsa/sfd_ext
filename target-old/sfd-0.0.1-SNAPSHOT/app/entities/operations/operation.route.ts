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

import { OperationComponent } from './operation.component';
import { OperationDetailComponent } from './operation-detail.component';
import { OperationPopupComponent } from './operation-dialog.component';
import { OperationDeletePopupComponent } from './operation-delete-dialog.component';
import { RetraitTpePrintSheetComponent} from './retrait-tpe-print-sheet.component';
import { RetraitLocalPrintSheetComponent } from './retrait-local-print-sheet.component'
import { Principal } from '../../shared';
import { ListeOperationComponent } from './liste-operation.component';
import { ListeOperationGuichetierComponent } from './list-depot-retrait-local.component';

import { ListeCommissionsGuichetierComponent } from './commission.component';

import { ConsulterSoldeComponent } from './consulter-solde';

@Injectable()
export class OperationResolvePagingParams implements Resolve<any> {
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

export const operationRoute: Routes = [
    {
        path: '',
        component: ListeOperationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: "Les Opérations d'un client"
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'commissions-guichetier',
        component: ListeCommissionsGuichetierComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: "Les Opérations d'un client"
        },
        canActivate: [UserRouteAccessService]
    },{
        path: 'consulter-solde',
        component: ConsulterSoldeComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: "Consulter le solde"
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'depot-retrait-local',
        component: ListeOperationGuichetierComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: "Les Opérations d'un client"
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'print',
        component: RetraitTpePrintSheetComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: "Les Opérations d'un client"
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'print-local',
        component: RetraitLocalPrintSheetComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: "Les Opérations d'un client"
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'liste',
        component: ListeOperationComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: "Les Opérations d'un client"
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ':id',
        component: OperationComponent,
        resolve: {
            pagingParams: OperationResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const operationPopupRoute: Routes = [
    {
        path: ':type',
        component: OperationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'operation-new',
        component: OperationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'operation/:id/edit',
        component: OperationPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'operation/:id/delete',
        component: OperationDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.operation.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
