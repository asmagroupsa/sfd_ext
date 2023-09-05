import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
  BudgetService,
  BudgetPopupService,
  BudgetComponent,
  BudgetDetailComponent,
  BudgetDialogComponent,
  BudgetPopupComponent,
  BudgetDeletePopupComponent,
  BudgetDeleteDialogComponent,
  budgetRoute,
  budgetPopupRoute,
  BudgetResolvePagingParams
} from '.';

const ENTITY_STATES = [...budgetRoute, ...budgetPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    BudgetComponent,
    BudgetDetailComponent,
    BudgetDialogComponent,
    BudgetDeleteDialogComponent,
    BudgetPopupComponent,
    BudgetDeletePopupComponent
  ],
  entryComponents: [
    BudgetComponent,
    BudgetDialogComponent,
    BudgetPopupComponent,
    BudgetDeleteDialogComponent,
    BudgetDeletePopupComponent
  ],
  providers: [BudgetService, BudgetPopupService, BudgetResolvePagingParams],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdBudgetModule {}
