import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  ProfessionService,
  ProfessionPopupService,
  ProfessionComponent,
  ProfessionDetailComponent,
  ProfessionDialogComponent,
  ProfessionPopupComponent,
  ProfessionDeletePopupComponent,
  ProfessionDeleteDialogComponent,
  professionRoute,
  professionPopupRoute,
  ProfessionResolvePagingParams
} from '.';

const ENTITY_STATES = [...professionRoute, ...professionPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    ProfessionComponent,
    ProfessionDetailComponent,
    ProfessionDialogComponent,
    ProfessionDeleteDialogComponent,
    ProfessionPopupComponent,
    ProfessionDeletePopupComponent
  ],
  entryComponents: [
    ProfessionComponent,
    ProfessionDialogComponent,
    ProfessionPopupComponent,
    ProfessionDeleteDialogComponent,
    ProfessionDeletePopupComponent
  ],
  providers: [
    ProfessionService,
    ProfessionPopupService,
    ProfessionResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdProfessionModule {}
