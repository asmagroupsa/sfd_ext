import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  LiteracyService,
  LiteracyPopupService,
  LiteracyComponent,
  LiteracyDetailComponent,
  LiteracyDialogComponent,
  LiteracyPopupComponent,
  LiteracyDeletePopupComponent,
  LiteracyDeleteDialogComponent,
  literacyRoute,
  literacyPopupRoute
} from '.';

const ENTITY_STATES = [...literacyRoute, ...literacyPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    LiteracyComponent,
    LiteracyDetailComponent,
    LiteracyDialogComponent,
    LiteracyDeleteDialogComponent,
    LiteracyPopupComponent,
    LiteracyDeletePopupComponent
  ],
  entryComponents: [
    LiteracyComponent,
    LiteracyDialogComponent,
    LiteracyPopupComponent,
    LiteracyDeleteDialogComponent,
    LiteracyDeletePopupComponent
  ],
  providers: [LiteracyService, LiteracyPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdLiteracyModule {}
