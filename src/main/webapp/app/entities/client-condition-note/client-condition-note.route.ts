import { Injectable } from '@angular/core';
import { EventBus } from '../../shared/model/functions';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { ClientConditionNoteComponent } from './client-condition-note.component';
import { ClientConditionNoteDetailComponent } from './client-condition-note-detail.component';
import { ClientConditionNotePopupComponent } from './client-condition-note-dialog.component';
import { ClientConditionNoteDeletePopupComponent } from './client-condition-note-delete-dialog.component';

@Injectable()
export class ClientConditionNoteResolvePagingParams implements Resolve<any> {

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

export const clientConditionNoteRoute: Routes = [
    {
        path: '',
        component: ClientConditionNoteComponent,
        resolve: {
            'pagingParams': ClientConditionNoteResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionNote.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: ':id',
        component: ClientConditionNoteDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionNote.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const clientConditionNotePopupRoute: Routes = [
    {
        path: 'client-condition-note-new',
        component: ClientConditionNotePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionNote.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'client-condition-note/:id/edit',
        component: ClientConditionNotePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionNote.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'client-condition-note/:id/delete',
        component: ClientConditionNoteDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'sfdApp.clientConditionNote.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
