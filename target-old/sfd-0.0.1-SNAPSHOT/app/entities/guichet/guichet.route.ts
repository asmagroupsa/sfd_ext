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

import { AnneeComponent } from "./guichet.component";
import { AnneeDetailComponent } from "./guichet-detail.component";
import { AnneePopupComponent } from "./guichet-dialog.component";
import { AnneeDeletePopupComponent } from "./guichet-delete-dialog.component";

import { Principal } from "../../shared";

export const anneeRoute: Routes = [
  {
    path: "",
    component: AnneeComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.annee.home.title"
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ":id",
    component: AnneeDetailComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.annee.home.title"
    },
    canActivate: [UserRouteAccessService]
  }
];

export const anneePopupRoute: Routes = [
  {
    path: "guichet-new",
    component: AnneePopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.annee.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "guichet/:id/edit",
    component: AnneePopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.annee.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  },
  {
    path: "guichet/:id/delete",
    component: AnneeDeletePopupComponent,
    data: {
      authorities: ["ROLE_USER"],
      pageTitle: "sfdApp.annee.home.title"
    },
    canActivate: [UserRouteAccessService],
    outlet: "popup"
  }
];
