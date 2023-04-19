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

import { EcheancesSFDComponent } from "./echeances-sfd.component";
import { EcheancesSFDDetailComponent } from "./echeances-sfd-detail.component";
import { EcheancesSFDPopupComponent } from "./echeances-sfd-dialog.component";
import { EcheancesSFDDeletePopupComponent } from "./echeances-sfd-delete-dialog.component";

import { Principal } from "../../../shared";

@Injectable()
export class EcheancesSFDResolvePagingParams implements Resolve<any> {
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

export const echeancesSFDRoute: Routes = [
  {
    path: "",
    component: EcheancesSFDComponent,
    resolve: {
      pagingParams: EcheancesSFDResolvePagingParams
    },
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesSFD.home.title"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ":id",
    component: EcheancesSFDDetailComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesSFD.home.title"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: "echeances-sfd-new",
    component: EcheancesSFDPopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesSFD.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
];

export const echeancesSFDPopupRoute: Routes = [
  // {
  //   path: "echeances-sfd-new",
  //   component: EcheancesSFDPopupComponent,
  //   data: {
  //     authorities: ["ROLE_USER"],
  //     pageTitle: "sfdApp.echeancesSFD.home.title"
  //   },
  //   canActivate: [UserRouteAccessService],
  //   outlet: "popup"
  // },
  {
    path: "echeances-sfd/:id/edit",
    component: EcheancesSFDPopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesSFD.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "echeances-sfd/:id/delete",
    component: EcheancesSFDDeletePopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.echeancesSFD.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  }
];
