import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { CreditRequestStatusService } from '../credit-request-status/credit-request-status.service';
import { RequestRaisonService } from '../request-raison/request-raison.service';
import { PeriodicityService } from '../periodicity/periodicity.service';
import { ProduitService } from '../produit/produit.service';
import { ClientService } from '../client/client.service';
import { ServiceUserService } from '../service-user/service-user.service';
import {
    CreditRequestService,
    CreditRequestPopupService,
    CreditRequestComponent,
    CreditRequestDetailComponent,
    CreditRequestDialogComponent,
    CreditRequestPopupComponent,
    CreditRequestDeletePopupComponent,
    CreditRequestDeleteDialogComponent,
    creditRequestRoute,
    creditRequestPopupRoute,
    CreditRequestResolvePagingParams,
} from '.';
import {
    StatusPipe,
    SatutsOrderPipe,
    PeriodPipe,
    DemandeStatusNamePipe
} from './pipe';
import { ConditionRequestService } from '../condition-request/condition-request.service';
import { CreditRequestPrintComponent } from './credit-request-print.component';
import { TypeClientService } from '../type-client';
import { ImageService } from '../../shared';
import { CreditRequestMontantsPopupComponent, CreditRequestMontantComponent } from './credit-request-montants.component';
import {CreditRequestPrintNewComponent} from './credit-request-print-new.component';
import {DatePipe, CurrencyPipe} from '@angular/common';
import {PhaseService} from "../phase/phase.service";
import { CreditRequestValiderRevolvingComponent } from './credit-request-valider-revolving.component';

const ENTITY_STATES = [...creditRequestRoute, ...creditRequestPopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CreditRequestComponent,
        CreditRequestDetailComponent,
        CreditRequestDialogComponent,
        CreditRequestDeleteDialogComponent,
        CreditRequestPopupComponent,
        CreditRequestDeletePopupComponent,
        StatusPipe,
        DemandeStatusNamePipe,
        SatutsOrderPipe,
        PeriodPipe,
        CreditRequestPrintComponent,
        CreditRequestMontantsPopupComponent,
        CreditRequestMontantComponent,
        CreditRequestPrintNewComponent,
        CreditRequestValiderRevolvingComponent
    ],
    entryComponents: [
        CreditRequestComponent,
        CreditRequestPopupComponent,
        CreditRequestDialogComponent,
        CreditRequestMontantComponent,
        CreditRequestDeletePopupComponent,
        CreditRequestDeleteDialogComponent,
        CreditRequestMontantsPopupComponent
    ],
    providers: [
        ConditionRequestService,
        CreditRequestStatusService,
        RequestRaisonService,
        ServiceUserService,
        ProduitService,
        PeriodicityService,
        ClientService,
        CreditRequestService,
        CreditRequestPopupService,
        CreditRequestResolvePagingParams,
        TypeClientService,
        ImageService,
        CurrencyPipe,
        DatePipe,
        PhaseService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCreditRequestModule { }
