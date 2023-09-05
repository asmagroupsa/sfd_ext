import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { PeriodicityService } from '../periodicity/periodicity.service';
import { TypeGarantieService } from '../type-garantie/type-garantie.service';
import { FraisService } from '../frais/frais.service';
import { TranchePenalService } from '../tranche-penal/tranche-penal.service';
import { CategoriePipe, ByCategoriePipe } from './pipe';
import { TauxEpargneService } from '../taux-epargne/taux-epargne.service';
import { ConditionAccesService } from '../condition-acces/condition-acces.service';
import {
    RequestPartnerService,
    RequestPartnerPopupService,
    RequestPartnerComponent,
    RequestPartnerDetailComponent,
    RequestPartnerDialogComponent,
    RequestPartnerPopupComponent,
    RequestPartnerRoute,
    requestPartnerPopupRoute,
    RequestPartnerResolvePagingParams,
} from '.';
import { TypeClientService } from '../type-client';
import { TypesContratService } from '../types-contrat/types-contrat.service';
import { PenalityService } from '../penality';
import { RequestPatnerConfirmPopupComponent, RequestPatnerConfirmComponent } from './request-patner-confirm-dialog.component';
import { RequestPartnerDeletePopupComponent, RequestPartnerDeleteDialogComponent } from './request-patner-delete-dialog.component';
const ENTITY_STATES = [...RequestPartnerRoute, ...requestPartnerPopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        RequestPartnerComponent,
        RequestPartnerDetailComponent,
        RequestPartnerDialogComponent,
        RequestPartnerDeleteDialogComponent,
        RequestPartnerPopupComponent,
        RequestPartnerDeletePopupComponent,
        CategoriePipe,
        ByCategoriePipe,
        RequestPatnerConfirmPopupComponent,
        RequestPatnerConfirmComponent
    ],
    entryComponents: [
        RequestPartnerComponent,
        RequestPartnerDialogComponent,
        RequestPartnerPopupComponent,
        RequestPartnerDeleteDialogComponent,
        RequestPatnerConfirmComponent,
        RequestPartnerDeletePopupComponent,
        RequestPatnerConfirmPopupComponent
    ],
    providers: [
        TypeGarantieService,
        ConditionAccesService,
        FraisService,
        TypesContratService,
        TranchePenalService,
        TauxEpargneService,
        PeriodicityService,
        RequestPartnerService,
        RequestPartnerPopupService,
        RequestPartnerResolvePagingParams,
        TypeClientService,
        PenalityService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdRequestPatnerModule {}
