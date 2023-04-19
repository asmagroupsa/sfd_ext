import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  AnneeService,
  AnneePopupService,
  AnneeComponent,
  AnneeDetailComponent,
  AnneeDialogComponent,
  AnneePopupComponent,
  AnneeDeletePopupComponent,
  AnneeDeleteDialogComponent,
  anneeRoute,
  anneePopupRoute
} from '.';

const ENTITY_STATES = [...anneeRoute, ...anneePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    AnneeComponent,
    AnneeDetailComponent,
    AnneeDialogComponent,
    AnneeDeleteDialogComponent,
    AnneePopupComponent,
    AnneeDeletePopupComponent
  ],
  entryComponents: [
    AnneeComponent,
    AnneeDialogComponent,
    AnneePopupComponent,
    AnneeDeleteDialogComponent,
    AnneeDeletePopupComponent
  ],
  providers: [AnneeService, AnneePopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCautionsModule {}
