import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

import {SfdSharedModule} from '../../shared';
import {
    DelegatedMemberService,
    DelegatedMemberPopupService,
    DelegatedMemberComponent,
    DelegatedMemberDetailComponent,
    DelegatedMemberDialogComponent,
    DelegatedMemberPopupComponent,
    DelegatedMemberDeletePopupComponent,
    DelegatedMemberDeleteDialogComponent,
    delegatedMemberRoute,
    delegatedMemberPopupRoute,
    DelegatedMemberResolvePagingParams
} from '.';
import {ComityMberService} from '../comity-mber/comity-mber.service';
import {DelegationComityService} from '../delegation-comity/delegation-comity.service';
import {RoleDelegatedMemberService} from '../role-delegated-member/role-delegated-member.service';

const ENTITY_STATES = [...delegatedMemberRoute, ...delegatedMemberPopupRoute];

@NgModule({
    imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        DelegatedMemberComponent,
        DelegatedMemberDetailComponent,
        DelegatedMemberDialogComponent,
        DelegatedMemberDeleteDialogComponent,
        DelegatedMemberPopupComponent,
        DelegatedMemberDeletePopupComponent
    ],
    entryComponents: [
        DelegatedMemberComponent,
        DelegatedMemberDialogComponent,
        DelegatedMemberPopupComponent,
        DelegatedMemberDeleteDialogComponent,
        DelegatedMemberDeletePopupComponent
    ],
    providers: [
        DelegationComityService,
        ComityMberService,
        DelegatedMemberService,
        DelegatedMemberPopupService,
        DelegatedMemberResolvePagingParams,
        RoleDelegatedMemberService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdDelegatedMemberModule {}
