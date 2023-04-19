import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import { ConditionAccesService } from '../condition-acces/condition-acces.service';
import {
    ElementConditionService,
    ElementConditionPopupService,
    ElementConditionComponent,
    ElementConditionDetailComponent,
    ElementConditionDialogComponent,
    ElementConditionPopupComponent,
    ElementConditionDeletePopupComponent,
    ElementConditionDeleteDialogComponent,
    elementConditionRoute,
    elementConditionPopupRoute,
    ElementConditionResolvePagingParams,
} from '.';

const ENTITY_STATES = [
    ...elementConditionRoute,
    ...elementConditionPopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ElementConditionComponent,
        ElementConditionDetailComponent,
        ElementConditionDialogComponent,
        ElementConditionDeleteDialogComponent,
        ElementConditionPopupComponent,
        ElementConditionDeletePopupComponent,
    ],
    entryComponents: [
        ElementConditionComponent,
        ElementConditionDialogComponent,
        ElementConditionPopupComponent,
        ElementConditionDeleteDialogComponent,
        ElementConditionDeletePopupComponent,
    ],
    providers: [
        ConditionAccesService,
        ElementConditionService,
        ElementConditionPopupService,
        ElementConditionResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdElementConditionModule {}
