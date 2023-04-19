import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { TypeCaisseService } from '../type-caisse/type-caisse.service';
import {
  CaisseCentraleService,
  CaissePopupService,
  CaisseComponent,
  CaisseDetailComponent,
  CaisseDialogComponent,
  CaissePopupComponent,
  CaisseDeletePopupComponent,
  CaisseDeleteDialogComponent,
  caisseRoute,
  caissePopupRoute,
  CaisseResolvePagingParams
} from '.';

const ENTITY_STATES = [...caisseRoute, ...caissePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    CaisseComponent,
    CaisseDetailComponent,
    CaisseDialogComponent,
    CaisseDeleteDialogComponent,
    CaissePopupComponent,
    CaisseDeletePopupComponent
  ],
  entryComponents: [
    CaisseComponent,
    CaisseDialogComponent,
    CaissePopupComponent,
    CaisseDeleteDialogComponent,
    CaisseDeletePopupComponent
  ],
  providers: [
    TypeCaisseService,
    CaisseCentraleService,
    CaissePopupService,
    CaisseResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCaisseCentraleModule { }
