import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  TypeCreditRetardService,
  TypeCreditRetardPopupService,
  TypeCreditRetardComponent,
  TypeCreditRetardDetailComponent,
  TypeCreditRetardDialogComponent,
  TypeCreditRetardPopupComponent,
  TypeCreditRetardDeletePopupComponent,
  TypeCreditRetardDeleteDialogComponent,
  typeCreditRetardRoute,
  typeCreditRetardPopupRoute
} from '.';

const ENTITY_STATES = [...typeCreditRetardRoute, ...typeCreditRetardPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    TypeCreditRetardComponent,
    TypeCreditRetardDetailComponent,
    TypeCreditRetardDialogComponent,
    TypeCreditRetardDeleteDialogComponent,
    TypeCreditRetardPopupComponent,
    TypeCreditRetardDeletePopupComponent
  ],
  entryComponents: [
    TypeCreditRetardComponent,
    TypeCreditRetardDialogComponent,
    TypeCreditRetardPopupComponent,
    TypeCreditRetardDeleteDialogComponent,
    TypeCreditRetardDeletePopupComponent
  ],
  providers: [
    TypeCreditRetardService,
    TypeCreditRetardPopupService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTypeCreditRetardModule { }
