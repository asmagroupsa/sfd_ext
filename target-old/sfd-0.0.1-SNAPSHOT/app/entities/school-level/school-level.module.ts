import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  SchoolLevelService,
  SchoolLevelPopupService,
  SchoolLevelComponent,
  SchoolLevelDetailComponent,
  SchoolLevelDialogComponent,
  SchoolLevelPopupComponent,
  SchoolLevelDeletePopupComponent,
  SchoolLevelDeleteDialogComponent,
  schoolLevelRoute,
  schoolLevelPopupRoute
} from '.';

const ENTITY_STATES = [...schoolLevelRoute, ...schoolLevelPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    SchoolLevelComponent,
    SchoolLevelDetailComponent,
    SchoolLevelDialogComponent,
    SchoolLevelDeleteDialogComponent,
    SchoolLevelPopupComponent,
    SchoolLevelDeletePopupComponent
  ],
  entryComponents: [
    SchoolLevelComponent,
    SchoolLevelDialogComponent,
    SchoolLevelPopupComponent,
    SchoolLevelDeleteDialogComponent,
    SchoolLevelDeletePopupComponent
  ],
  providers: [SchoolLevelService, SchoolLevelPopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdSchoolLevelModule {}
