import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
    CategorieConditionService,
    CategorieConditionPopupService,
    CategorieConditionComponent,
    CategorieConditionDetailComponent,
    CategorieConditionDialogComponent,
    CategorieConditionPopupComponent,
    CategorieConditionDeletePopupComponent,
    CategorieConditionDeleteDialogComponent,
    categorieConditionRoute,
    categorieConditionPopupRoute,
    CategorieConditionResolvePagingParams,
} from '.';

const ENTITY_STATES = [
    ...categorieConditionRoute,
    ...categorieConditionPopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        CategorieConditionComponent,
        CategorieConditionDetailComponent,
        CategorieConditionDialogComponent,
        CategorieConditionDeleteDialogComponent,
        CategorieConditionPopupComponent,
        CategorieConditionDeletePopupComponent,
    ],
    entryComponents: [
        CategorieConditionComponent,
        CategorieConditionDialogComponent,
        CategorieConditionPopupComponent,
        CategorieConditionDeleteDialogComponent,
        CategorieConditionDeletePopupComponent,
    ],
    providers: [
        CategorieConditionService,
        CategorieConditionPopupService,
        CategorieConditionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdCategorieConditionModule {}
