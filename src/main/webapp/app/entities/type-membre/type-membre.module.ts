import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TypeMembreService,
  TypeMembrePopupService,
  TypeMembreComponent,
  TypeMembreDetailComponent,
  TypeMembreDialogComponent,
  TypeMembrePopupComponent,
  TypeMembreDeletePopupComponent,
  TypeMembreDeleteDialogComponent,
  typeMembreRoute,
  typeMembrePopupRoute
} from '.';

const ENTITY_STATES = [...typeMembreRoute, ...typeMembrePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TypeMembreComponent,
    TypeMembreDetailComponent,
    TypeMembreDialogComponent,
    TypeMembreDeleteDialogComponent,
    TypeMembrePopupComponent,
    TypeMembreDeletePopupComponent
  ],
  entryComponents: [
    TypeMembreComponent,
    TypeMembreDialogComponent,
    TypeMembrePopupComponent,
    TypeMembreDeleteDialogComponent,
    TypeMembreDeletePopupComponent
  ],
  providers: [TypeMembreService, TypeMembrePopupService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTypeMembreModule {}
