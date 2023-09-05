import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  SituationMatService,
  SituationMatPopupService,
  SituationMatComponent,
  SituationMatDetailComponent,
  SituationMatDialogComponent,
  SituationMatPopupComponent,
  SituationMatDeletePopupComponent,
  SituationMatDeleteDialogComponent,
  situationMatRoute,
  situationMatPopupRoute
} from '.';

const ENTITY_STATES = [...situationMatRoute, ...situationMatPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SituationMatComponent,
    SituationMatDetailComponent,
    SituationMatDialogComponent,
    SituationMatDeleteDialogComponent,
    SituationMatPopupComponent,
    SituationMatDeletePopupComponent
  ],
  entryComponents: [
    SituationMatComponent,
    SituationMatDialogComponent,
    SituationMatPopupComponent,
    SituationMatDeleteDialogComponent,
    SituationMatDeletePopupComponent
  ],
  providers: [SituationMatService, SituationMatPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSituationMatModule {}
