import { Client } from './client.model';
import { GroupMember } from '../group-member/group-member.model';
import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
  name: 'groupmember'
})
export class GroupMemberPipe implements PipeTransform {
  transform(groupes: GroupMember[], clientGrpe: Client) {
    if (!clientGrpe) return [];
    return groupes.filter((groupe: GroupMember) => {
      return groupe.cltId == clientGrpe.id;
    });
  }
}
