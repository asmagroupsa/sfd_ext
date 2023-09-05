import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../../entities/client/client.model';
import { TypeClient } from '../../entities/type-client/type-client.model';

@Pipe({ name: 'sorted' })
export class SortedPipe implements PipeTransform {
  transform(tabs: any[], field: string, desc: boolean = true) {
    return tabs.sort((a, b) => {
      if (a[field] > b[field]) return desc ? -1 : 1;
      else if (a[field] < b[field]) return desc ? 1 : -1;
      else return 0;
    });
  }
}

@Pipe({ name: 'nonNullable' })
export class NonNullablePipe implements PipeTransform {
  transform(tabs: any[], field: string = 'reference') {
    if (!Array.isArray(tabs) || !tabs || !tabs.length) return [];
    return (tabs || []).filter((a) => {
      return a[field] && a[field].trim().length;
    });
  }
}

@Pipe({ name: 'cible' })
export class CiblePipe implements PipeTransform {
  transform(clients: Client[], typeClients: TypeClient[]) {
    return clients;
    /* if (!typeClients || !clients) return clients;
    let findType;
    return clients.filter(client => {
      findType = typeClients.find(type => {
        return type.id == client.typeClientId;
      });
      return findType != undefined;
    }); */
  }
}
