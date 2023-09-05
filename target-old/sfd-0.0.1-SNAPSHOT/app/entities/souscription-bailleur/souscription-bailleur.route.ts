import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
  CanActivate
} from "@angular/router";

import { UserRouteAccessService } from "../../shared";
import { JhiPaginationUtil } from "ng-jhipster";

import { SOUSCRIPTIONBAILLEURComponent } from "./souscription-bailleur.component";
import { SouscriptionBailleurDetailComponent } from "./souscription-bailleur-detail.component";
import { SouscriptionBailleurPopupComponent } from "./souscription-bailleur-dialog.component";
import { SouscriptionBailleurDeletePopupComponent } from "./souscription-bailleur-delete-dialog.component";

import { Principal } from "../../shared";

@Injectable()
export class SOUSCRIPTIONBAILLEURResolvePagingParams implements Resolve<any> {
  constructor(private paginationUtil: JhiPaginationUtil) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const page = route.queryParams["page"] ? route.queryParams["page"] : "1";
    const sort = route.queryParams["sort"]
      ? route.queryParams["sort"]
      : "id,asc";
    return {
      page: this.paginationUtil.parsePage(page),
      predicate: this.paginationUtil.parsePredicate(sort),
      ascending: this.paginationUtil.parseAscending(sort)
    };
  }
}

export const souscriptionBailleurRoute: Routes = [
  {
    path: "",
    component: SOUSCRIPTIONBAILLEURComponent,
    resolve: {
      pagingParams: SOUSCRIPTIONBAILLEURResolvePagingParams
    },
    data: {
      authorities: ["ROLE_USER"],
      ressources: ['carmesfnmservice/api/s-fds/getAllSOUSCRIPTIONBAILLEURS'],
      pageTitle: "sfdApp.souscriptionBailleur.home.title"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ":id",
    component: SouscriptionBailleurDetailComponent,
    data: {
      authorities: ["ROLE_USER"],
      ressources: [],
      pageTitle: "sfdApp.souscriptionBailleur.home.title"
    },
    canActivate: [UserRouteAccessService]
  }
];

export const souscriptionBailleurPopupRoute: Routes = [
  {
    path: "souscription-bailleur-new",
    component: SouscriptionBailleurPopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      ressources: ['carmesfnmservice/api/s-fds/createSOUSCRIPTIONBAILLEUR'],
      pageTitle: "sfdApp.souscriptionBailleur.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "souscription-bailleur/:id/edit",
    component: SouscriptionBailleurPopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      ressources: ['carmesfnmservice/api/s-fds/updateSOUSCRIPTIONBAILLEUR'],
      pageTitle: "sfdApp.souscriptionBailleur.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "souscription-bailleur/:id/delete",
    component: SouscriptionBailleurDeletePopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      ressources: ['carmesfnmservice/api/s-fds/deleteSOUSCRIPTIONBAILLEUR'],
      pageTitle: "sfdApp.souscriptionBailleur.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  }
];
