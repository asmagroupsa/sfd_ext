import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SfdSharedModule } from '../../shared';
import {
    TypeClientService,
    TypeClientPopupService,
    TypeClientComponent,
    TypeClientDetailComponent,
    TypeClientDialogComponent,
    TypeClientPopupComponent,
    TypeClientDeletePopupComponent,
    TypeClientDeleteDialogComponent,
    typeClientRoute,
    typeClientPopupRoute,
} from '.';
import { FraisService } from '../frais-client/frais.service';

const ENTITY_STATES = [
    ...typeClientRoute,
    ...typeClientPopupRoute,
];

@NgModule({
    imports: [
        SfdSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        TypeClientComponent,
        TypeClientDetailComponent,
        TypeClientDialogComponent,
        TypeClientDeleteDialogComponent,
        TypeClientPopupComponent,
        TypeClientDeletePopupComponent,
    ],
    entryComponents: [
        TypeClientComponent,
        TypeClientDialogComponent,
        TypeClientPopupComponent,
        TypeClientDeleteDialogComponent,
        TypeClientDeletePopupComponent,
    ],
    providers: [
        TypeClientService,
        FraisService,
        TypeClientPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdTypeClientModule { }
