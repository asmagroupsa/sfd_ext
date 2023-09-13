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

import { SOUSCRIPTIONSfdComponent } from "./souscription-sfd.component";
import { SouscriptionSfdDetailComponent } from "./souscription-sfd-detail.component";
import { SouscriptionSfdPopupComponent } from "./souscription-sfd-dialog.component";
import { SouscriptionSfdDeletePopupComponent } from "./souscription-sfd-delete-dialog.component";

import { Principal } from "../../shared";

@Injectable()
export class SOUSCRIPTIONSfdResolvePagingParams implements Resolve<any> {
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

export const souscriptionSfdRoute: Routes = [
  {
    path: "",
    component: SOUSCRIPTIONSfdComponent,
    resolve: {
      pagingParams: SOUSCRIPTIONSfdResolvePagingParams
    },
    data: {
      authorities: ["ROLE_USER"],
      ressources: ['carmesfnmservice/api/s-fds/getAllSOUSCRIPTIONBAILLEURS'],
      pageTitle: "sfdApp.souscriptionSfd.home.title"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ":id",
    component: SouscriptionSfdDetailComponent,
    data: {
      authorities: ["ROLE_USER"],
      ressources: [],
      pageTitle: "sfdApp.souscriptionSfd.home.title"
    },
    canActivate: [UserRouteAccessService]
  }
];

export const souscriptionSfdPopupRoute: Routes = [
  {
    path: "souscription-sfd-new",
    component: SouscriptionSfdPopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      ressources: ['carmesfnmservice/api/s-fds/createSOUSCRIPTIONBAILLEUR'],
      pageTitle: "sfdApp.souscriptionSfd.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "souscription-Sfd/:id/edit",
    component: SouscriptionSfdPopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      ressources: ['carmesfnmservice/api/s-fds/updateSOUSCRIPTIONBAILLEUR'],
      pageTitle: "sfdApp.souscriptionSfd.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "souscription-sfd/:id/delete",
    component: SouscriptionSfdDeletePopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      ressources: ['carmesfnmservice/api/s-fds/deleteSOUSCRIPTIONBAILLEUR'],
      pageTitle: "sfdApp.souscriptionSfd.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  }
];
