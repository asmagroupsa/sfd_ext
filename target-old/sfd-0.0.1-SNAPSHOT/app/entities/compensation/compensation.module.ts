import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule, ImageService } from '../../shared';
import { ClientService } from '../client/client.service';
import { CompensationTypeService } from '../compensation-type/compensation-type.service';
import {BankAccountService} from '../bank-account';
import { CompensationOrdreSheetComponent } from './compensation-ordre-sheet.component';
import {
  CompensationService,
  CompensationPopupService,
  CompensationComponent,
  CompensationDetailComponent,
  CompensationDialogComponent,
  CompensationPopupComponent,
  CompensationDeletePopupComponent,
  CompensationDeleteDialogComponent,
  compensationRoute,
  compensationPopupRoute,
  CompensationResolvePagingParams,
  CompensationPrintSheetComponent
} from '.';
import { OrdreVirementPrintSheetComponent } from './transfert-order-print-sheet.component';
import {SPUtilService} from '../../shared/sp-util.service';
import {TransferOrderPrintComponent} from './transfer-order-print.component';
import {DatePipe, CurrencyPipe} from '@angular/common';
import {SPFNMService} from "../../shared/sp-fnm.service";
import { UtilService } from '../../shared/util.service';
import { PartnerService } from '../partner';

const ENTITY_STATES = [...compensationRoute, ...compensationPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CompensationComponent,
    CompensationDetailComponent,
    CompensationDialogComponent,
    CompensationDeleteDialogComponent,
    CompensationPopupComponent,
    CompensationDeletePopupComponent,
    CompensationPrintSheetComponent,
    OrdreVirementPrintSheetComponent,
    TransferOrderPrintComponent,
    CompensationOrdreSheetComponent
  ],
  entryComponents: [
    CompensationComponent,
    CompensationDialogComponent,
    CompensationPopupComponent,
    CompensationDeleteDialogComponent,
    CompensationDeletePopupComponent,
    CompensationOrdreSheetComponent
  ],
  providers: [
    ClientService,
    BankAccountService,
    CompensationTypeService,
    CompensationService,
    CompensationPopupService,
    SPUtilService,
    CompensationResolvePagingParams,
    CurrencyPipe,
    DatePipe,
    ImageService,
    SPFNMService,
    UtilService,
    PartnerService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCompensationModule {}
