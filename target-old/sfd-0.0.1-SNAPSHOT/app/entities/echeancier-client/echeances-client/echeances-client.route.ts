import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
  CanActivate
} from "@angular/router";

import { UserRouteAccessService } from "../../../shared";
import { JhiPaginationUtil } from "ng-jhipster";

import { EcheancesClientComponent } from "./echeances-client.component";
import { EcheancesClientDetailComponent } from "./echeances-client-detail.component";
import { EcheancesClientPopupComponent } from "./echeances-client-dialog.component";
import { EcheancesClientDeletePopupComponent } from "./echeances-client-delete-dialog.component";

import { Principal } from "../../../shared";

@Injectable()
export class EcheancesClientResolvePagingParams implements Resolve<any> {
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

export const echeancesClientRoute: Routes = [
  {
    path: "",
    component: EcheancesClientComponent,
    resolve: {
      pagingParams: EcheancesClientResolvePagingParams
    },
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesClient.home.title"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ":id",
    component: EcheancesClientDetailComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesClient.home.title"
    },
    canActivate: [UserRouteAccessService]
  }
];

export const echeancesClientPopupRoute: Routes = [
  {
    path: "echeances-client-new",
    component: EcheancesClientPopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesClient.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "echeances-client/:id/edit",
    component: EcheancesClientPopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesClient.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "echeances-client/:id/delete",
    component: EcheancesClientDeletePopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesClient.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  }
];
