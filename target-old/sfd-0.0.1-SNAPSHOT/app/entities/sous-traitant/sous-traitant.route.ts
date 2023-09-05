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

import { SousTraitantComponent } from './sous-traitant.component';
import { PhasePopupComponent } from './sous-traitant-dialog.component';
import {CompensationRequestComponent} from "./compensation-request.component";

@Injectable()
export class PosteResolvePagingParams implements Resolve<any> {
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

export const posteRoute: Routes = [
  {
    path: '',
    component: SousTraitantComponent,
    resolve: {
      pagingParams: PosteResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'compensation-request',
    component: CompensationRequestComponent,
    resolve: {
      pagingParams: PosteResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService]
  },
  /* {
    path: ':id',
    component: PosteDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService]
  } */
];

export const postePopupRoute: Routes = [
  {
    path: 'sous-traitant-new',
    component: PhasePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'sous-traitant/:id/edit',
    component: PhasePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  /* {
    path: 'poste/:id/delete',
    component: PosteDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'sfdApp.poste.home.title'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  } */
];
