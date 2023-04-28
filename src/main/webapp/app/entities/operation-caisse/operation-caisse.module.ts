import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  OperationCaisseService,
  OperationCaissePopupService,
  OperationCaisseComponent,
  OperationCaisseDetailComponent,
  OperationCaisseDialogComponent,
  OperationCaissePopupComponent,
  OperationCaisseDeletePopupComponent,
  OperationCaisseDeleteDialogComponent,
  OperationCaisseRoute,
  OperationCaissePopupRoute
} from '.';
import { ProduitService } from '../produit';
import { NationalityService } from '../nationality';
import { TypeClientService } from '../type-client';
import { ProfessionService } from '../profession';

const ENTITY_STATES = [...OperationCaisseRoute, ...OperationCaissePopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    OperationCaisseComponent,
    OperationCaisseDetailComponent,
    OperationCaisseDialogComponent,
    OperationCaisseDeleteDialogComponent,
    OperationCaissePopupComponent,
    OperationCaisseDeletePopupComponent
  ],
  entryComponents: [
    OperationCaisseComponent,
    OperationCaisseDialogComponent,
    OperationCaissePopupComponent,
    OperationCaisseDeleteDialogComponent,
    OperationCaisseDeletePopupComponent
  ],
  providers: [
    OperationCaisseService,
    OperationCaissePopupService,
    ProduitService,
    NationalityService,
    ProfessionService,
    TypeClientService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdOperationCaisseModule { }
