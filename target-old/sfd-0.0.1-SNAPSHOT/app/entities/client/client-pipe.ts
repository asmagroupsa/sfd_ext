import { PipeTransform, Pipe } from '@angular/core';
import { Client } from './client.model';

@Pipe({
    name: 'typeclient'
})
export class TypeClientPipe implements PipeTransform {
    transform(clients: Client[]) {
        return clients;
        /*  return clients.sort((a: Client, b: Client) => {
          return b.id - a.id;
        }); */
    }
}

@Pipe({
    name: 'type'
})
export class ClientPipe implements PipeTransform {
    transform(typeClientId: number) {
        if (!typeClientId) return '';
        let type = '';
        if (typeClientId == 7) return 'INDIVIDU';
        else if (typeClientId == 8) return 'ENTREPRISE';
        else if (typeClientId == 6) return 'MUTUEL';
    }
}

@Pipe({ name: 'roles', pure: false })
export class RolesPipe implements PipeTransform {
    transform(roles: string[], selectedRoles: any[]): string[] {
        const rolesRemoved: string[] = ['PRESIDENT', 'SECRETAIRE'];

        /* for (const selectedRole of selectedRoles) {
          if (rolesRemoved.indexOf(selectedRole) >= 0) {
            roles.splice(roles.indexOf(selectedRole), 1);
          }
        }
         */
        return roles;
    }
}
@Pipe({ name: 'memberUnique', pure: false })
export class MembreUniquePipe implements PipeTransform {

    transform(clients: Client[], selectedIndividu): Client[] {
        return clients.filter((client) => {
            // for (const selectedIndividu of selectedIndividus) {
            if (client.id === parseInt(selectedIndividu, 10)) {
                return false;
            }
            // }

            return true;
        });
    }
}

@Pipe({
    name: 'status',
    pure: false
})
export class StatusPipe implements PipeTransform {
    transform(clients: any[], status): Client[] {
        return clients.filter((client) => !client.status || client.status == status);
    }
}
