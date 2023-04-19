import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
    ClientConditionNoteService,
    ClientConditionNotePopupService,
    ClientConditionNoteComponent,
    ClientConditionNoteDetailComponent,
    ClientConditionNoteDialogComponent,
    ClientConditionNotePopupComponent,
    ClientConditionNoteDeletePopupComponent,
    ClientConditionNoteDeleteDialogComponent,
    clientConditionNoteRoute,
    clientConditionNotePopupRoute,
    ClientConditionNoteResolvePagingParams,
} from '.';

const ENTITY_STATES = [
    ...clientConditionNoteRoute,
    ...clientConditionNotePopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ClientConditionNoteComponent,
        ClientConditionNoteDetailComponent,
        ClientConditionNoteDialogComponent,
        ClientConditionNoteDeleteDialogComponent,
        ClientConditionNotePopupComponent,
        ClientConditionNoteDeletePopupComponent,
    ],
    entryComponents: [
        ClientConditionNoteComponent,
        ClientConditionNoteDialogComponent,
        ClientConditionNotePopupComponent,
        ClientConditionNoteDeleteDialogComponent,
        ClientConditionNoteDeletePopupComponent,
    ],
    providers: [
        ClientConditionNoteService,
        ClientConditionNotePopupService,
        ClientConditionNoteResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdClientConditionNoteModule {}
