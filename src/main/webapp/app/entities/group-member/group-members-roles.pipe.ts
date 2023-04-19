import { PipeTransform, Pipe } from '@angular/core';

@Pipe({name: 'groupMembersRoles'})
export class GroupMembersRolesPipe implements PipeTransform {
    transform(roles: string[], members: any[]) {
        /* const rolesRemoved: string[] = ['PRESIDENT', 'SECRETAIRE'];

        for (const member of members) {
            const memberRole: string = member.memberRole;

            if (rolesRemoved.indexOf(memberRole) >= 0) {
                roles.splice(roles.indexOf(memberRole), 1);
            }
        }

        return roles; */
        let _roles = [
            'PRESIDENT',
            'SECRETAIRE',
            'TRESORIER',
            // 'MEMBRE',
        ];
        const memberRoles = members
        .filter((m) => m.status)
        .map((m) => m.memberRole)
        // .filter((r) => _roles.indexOf(r) === -1);

        _roles = _roles.filter((r) => memberRoles.indexOf(r) === -1);

        _roles.push('MEMBRE');

        return _roles;
    }
}
