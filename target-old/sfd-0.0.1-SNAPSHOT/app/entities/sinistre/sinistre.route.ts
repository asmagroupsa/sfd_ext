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

import { Principal } from '../../shared';
import { SinistresComponent } from './sinistres.component';
import { SnistreDetailComponent, SinistreDeletePopupComponent } from '.';
import { SinistrePopupComponent } from './sinistre-dialog.component';
import { SinistreReglementComponent, ReglementSinistrePopupComponent } from './sinistre-reglement-dialog.component';

@Injectable()
export class SinistreResolvePagingParams implements Resolve<any> {
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

export const sinistreRoute: Routes = [
  {
    path: '',
    component: SinistresComponent,
    resolve: {
      pagingParams: SinistreResolvePagingParams
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sinistre'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id',
    component: SnistreDetailComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sinistre'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const sinistrePopupRoute: Routes = [
  {
    path: 'sinistre-new',
    component: SinistrePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sinistre'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'sinistre/:id/edit',
    component: SinistrePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sinistre'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'sinistre/:id/delete',
    component: SinistreDeletePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sinistre'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
  {
    path: 'reglement-sinistre',
    component: ReglementSinistrePopupComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Sinistre'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  },
];
