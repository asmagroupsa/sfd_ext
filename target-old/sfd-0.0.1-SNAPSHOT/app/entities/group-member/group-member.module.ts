import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {IndividuPipe,GroupPipe} from './pipe';
import { SfdSharedModule } from '../../shared';
import { ClientService } from '../client/client.service';
import {
  GroupMemberService,
  GroupMemberPopupService,
  GroupMemberComponent,
  GroupMemberDetailComponent,
  GroupMemberDialogComponent,
  GroupMemberPopupComponent,
  GroupMemberDeletePopupComponent,
  GroupMemberDeleteDialogComponent,
  groupMemberRoute,
  groupMemberPopupRoute,
  GroupMemberResolvePagingParams
} from '.';

import {GroupMembersRolesPipe} from './group-members-roles.pipe';

const ENTITY_STATES = [...groupMemberRoute, ...groupMemberPopupRoute];

@NgModule({
  imports: [SfdSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    GroupMemberComponent,
    GroupMemberDetailComponent,
    GroupMemberDialogComponent,
    GroupMemberDeleteDialogComponent,
    GroupMemberPopupComponent,
    GroupMemberDeletePopupComponent,
    IndividuPipe,
    GroupPipe,
    GroupMembersRolesPipe
  ],
  entryComponents: [
    GroupMemberComponent,
    GroupMemberDialogComponent,
    GroupMemberPopupComponent,
    GroupMemberDeleteDialogComponent,
    GroupMemberDeletePopupComponent
  ],
  providers: [
    ClientService,
    GroupMemberService,
    GroupMemberPopupService,
    GroupMemberResolvePagingParams
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SfdGroupMemberModule {}
