import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {LigneCreditService} from '../ligne-credit';
import { PeriodicityService } from "../periodicity/periodicity.service";

import {
  PartnerService,
  PartnerPopupService,
  PartnerComponent,
  PartnerDetailComponent,
  PartnerDialogComponent,
  PartnerPopupComponent,
  PartnerDeletePopupComponent,
  PartnerDeleteDialogComponent,
  partnerRoute,
  partnerPopupRoute,
  PartnerResolvePagingParams,
  PartnerSheetComponent,
  LinePipe
} from '.';

const ENTITY_STATES = [...partnerRoute, ...partnerPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    PartnerComponent,
    PartnerDetailComponent,
    PartnerDialogComponent,
    PartnerDeleteDialogComponent,
    PartnerPopupComponent,
    PartnerDeletePopupComponent,
    PartnerSheetComponent,
    LinePipe
  ],
  entryComponents: [
    PartnerComponent,
    PartnerDialogComponent,
    PartnerPopupComponent,
    PartnerDeleteDialogComponent,
    PartnerDeletePopupComponent
  ],
  providers: [PartnerService, PartnerPopupService, PartnerResolvePagingParams,LigneCreditService,PeriodicityService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdPartnerModule {}
