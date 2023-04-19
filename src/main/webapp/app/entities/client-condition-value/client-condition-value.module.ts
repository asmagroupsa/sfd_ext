import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
    ClientConditionValueService,
    ClientConditionValuePopupService,
    ClientConditionValueComponent,
    ClientConditionValueDetailComponent,
    ClientConditionValueDialogComponent,
    ClientConditionValuePopupComponent,
    ClientConditionValueDeletePopupComponent,
    ClientConditionValueDeleteDialogComponent,
    clientConditionValueRoute,
    clientConditionValuePopupRoute,
    ClientConditionValueResolvePagingParams,
} from '.';

const ENTITY_STATES = [
    ...clientConditionValueRoute,
    ...clientConditionValuePopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ClientConditionValueComponent,
        ClientConditionValueDetailComponent,
        ClientConditionValueDialogComponent,
        ClientConditionValueDeleteDialogComponent,
        ClientConditionValuePopupComponent,
        ClientConditionValueDeletePopupComponent,
    ],
    entryComponents: [
        ClientConditionValueComponent,
        ClientConditionValueDialogComponent,
        ClientConditionValuePopupComponent,
        ClientConditionValueDeleteDialogComponent,
        ClientConditionValueDeletePopupComponent,
    ],
    providers: [
        ClientConditionValueService,
        ClientConditionValuePopupService,
        ClientConditionValueResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdClientConditionValueModule {}
