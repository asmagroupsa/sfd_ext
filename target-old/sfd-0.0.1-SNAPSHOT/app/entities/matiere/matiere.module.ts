import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { FormationService } from '../formation/formation.service';
import {
  MatiereService,
  MatierePopupService,
  MatiereComponent,
  MatiereDetailComponent,
  MatiereDialogComponent,
  MatierePopupComponent,
  MatiereDeletePopupComponent,
  MatiereDeleteDialogComponent,
  matiereRoute,
  matierePopupRoute,
  MatiereResolvePagingParams
} from '.';

const ENTITY_STATES = [...matiereRoute, ...matierePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    MatiereComponent,
    MatiereDetailComponent,
    MatiereDialogComponent,
    MatiereDeleteDialogComponent,
    MatierePopupComponent,
    MatiereDeletePopupComponent
  ],
  entryComponents: [
    MatiereComponent,
    MatiereDialogComponent,
    MatierePopupComponent,
    MatiereDeleteDialogComponent,
    MatiereDeletePopupComponent
  ],
  providers: [
    FormationService,
    MatiereService,
    MatierePopupService,
    MatiereResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdMatiereModule {}
