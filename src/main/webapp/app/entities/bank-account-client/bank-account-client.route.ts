import {Injectable} from '@angular/core';
import {EventBus} from '../../shared/model/functions';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate} from '@angular/router';

import {UserRouteAccessService} from '../../shared';
import {JhiPaginationUtil} from 'ng-jhipster';

import {BankAccountClientComponent} from './bank-account-client.component';
import {BankAccountClientDetailComponent} from './bank-account-client-detail.component';
import {BankAccountClientPopupComponent} from './bank-account-client-dialog.component';
import {BankAccountClientDeletePopupComponent} from './bank-account-client-delete-dialog.component';

@Injectable()
export class BankAccountClientResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,desc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    }
}

export const bankAccountClientRoute: Routes = [
    {
        path: '',
        component: BankAccountClientComponent,
        resolve: {
            'pagingParams': BankAccountClientResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.bank.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: ':id',
        component: BankAccountClientDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.bank.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const bankAccountClientPopupRoute: Routes = [
    {
        path: 'bank-account-client-new',
        component: BankAccountClientPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.bankAccountClient.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'bank-account-client/:id/edit',
        component: BankAccountClientPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.bank.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'bank-account-client/:id/delete',
        component: BankAccountClientDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.bank.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
