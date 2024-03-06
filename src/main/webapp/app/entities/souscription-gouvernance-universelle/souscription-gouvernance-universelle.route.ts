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

import { SOUSCRIPTIONGOUVERNANCEUNIVERSELLEComponent } from "./souscription-gouvernance-universelle.component";
import { SouscriptionGouvernanceUniverselleDetailComponent } from "./souscription-gouvernance-universelle-detail.component";
import { SouscriptionGouvernanceUniversellePopupComponent } from "./souscription-gouvernance-universelle-dialog.component";
import { SouscriptionGouvernanceUniverselleDeletePopupComponent } from "./souscription-gouvernance-universelle-delete-dialog.component";

import { Principal } from "../../shared";

@Injectable()
export class SOUSCRIPTIONGOUVERNANCEUNIVERSELLEResolvePagingParams implements Resolve<any> {
    constructor(private paginationUtil: JhiPaginationUtil) { }

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

export const souscriptionGouvernanceUniverselleRoute: Routes = [
    {
        path: "",
        component: SOUSCRIPTIONGOUVERNANCEUNIVERSELLEComponent,
        resolve: {
            pagingParams: SOUSCRIPTIONGOUVERNANCEUNIVERSELLEResolvePagingParams
        },
        data: {
            authorities: ["ROLE_USER"],
            ressources: ['carmesfnmservice/api/s-fds/getAllSOUSCRIPTIONGOUVERNANCEUNIVERSELLES'],
            pageTitle: "sfdApp.souscriptionGouvernanceUniverselle.home.title"
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: ":id",
        component: SouscriptionGouvernanceUniverselleDetailComponent,
        data: {
            authorities: ["ROLE_USER"],
            ressources: [],
            pageTitle: "sfdApp.souscriptionGouvernanceUniverselle.home.title"
        },
        canActivate: [UserRouteAccessService]
    }
];

export const souscriptionGouvernanceUniversellePopupRoute: Routes = [
    {
        path: "souscription-gouvernance-universelle-new",
        component: SouscriptionGouvernanceUniversellePopupComponent,
        data: {
            authorities: ["ROLE_USER"],
            ressources: ['carmesfnmservice/api/s-fds/createSOUSCRIPTIONGOUVERNANCEUNIVERSELLE'],
            pageTitle: "sfdApp.souscriptionGouvernanceUniverselle.home.title"
        },
        canActivate: [UserRouteAccessService],
        outlet: "popup"
    },
    {
        path: "souscription-gouvernance-universelle/:id/edit",
        component: SouscriptionGouvernanceUniversellePopupComponent,
        data: {
            authorities: ["ROLE_USER"],
            ressources: ['carmesfnmservice/api/s-fds/updateSOUSCRIPTIONGOUVERNANCEUNIVERSELLE'],
            pageTitle: "sfdApp.souscriptionGouvernanceUniverselle.home.title"
        },
        canActivate: [UserRouteAccessService],
        outlet: "popup"
    },
    {
        path: "souscription-gouvernance-universelle/:id/delete",
        component: SouscriptionGouvernanceUniverselleDeletePopupComponent,
        data: {
            authorities: ["ROLE_USER"],
            ressources: ['carmesfnmservice/api/s-fds/deleteSOUSCRIPTIONGOUVERNANCEUNIVERSELLE'],
            pageTitle: "sfdApp.souscriptionGouvernanceUniverselle.home.title"
        },
        canActivate: [UserRouteAccessService],
        outlet: "popup"
    }
];
