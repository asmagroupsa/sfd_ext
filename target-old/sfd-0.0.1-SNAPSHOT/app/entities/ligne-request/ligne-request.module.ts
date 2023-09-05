import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ProduitService } from '../produit/produit.service';
import { NotificationSFDService } from '../notification-sfd/notification-sfd.service';
import { SFDService } from '../s-fd/sfd.service';
import {
    LigneRequestService,
    LigneRequestPopupService,
    LigneRequestComponent,
    LigneRequestDetailComponent,
    LigneRequestDialogComponent,
    LigneRequestPopupComponent,
    LigneRequestDeletePopupComponent,
    LigneRequestDeleteDialogComponent,
    ligneRequestRoute,
    ligneRequestPopupRoute,
    LigneRequestResolvePagingParams
} from '.';
import { CreditComityService } from '../credit-comity/credit-comity.service';
import {DatePipe} from '@angular/common';
import {SPFNMService} from "../../shared/sp-fnm.service";
import { PartnerService } from '../partner';

const ENTITY_STATES = [...ligneRequestRoute, ...ligneRequestPopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        LigneRequestComponent,
        LigneRequestDetailComponent,
        LigneRequestDialogComponent,
        LigneRequestDeleteDialogComponent,
        LigneRequestPopupComponent,
        LigneRequestDeletePopupComponent
    ],
    entryComponents: [
        LigneRequestComponent,
        LigneRequestDialogComponent,
        LigneRequestPopupComponent,
        LigneRequestDeleteDialogComponent,
        LigneRequestDeletePopupComponent
    ],
    providers: [
        NotificationSFDService,
        ProduitService,
        SFDService,
        LigneRequestService,
        LigneRequestPopupService,
        LigneRequestResolvePagingParams,
        CreditComityService,
        SPFNMService,
        PartnerService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdLigneRequestModule { }
