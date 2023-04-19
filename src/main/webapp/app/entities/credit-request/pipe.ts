import { PipeTransform, Pipe } from '@angular/core';
import { CreditRequest } from './credit-request.model';
import { Periodicity } from '../periodicity/periodicity.model';
import { Produit } from '../produit/produit.model';

@Pipe({ name: 'client' })
export class StatusPipe implements PipeTransform {
    transform(requests: CreditRequest[], params: any) {
        if (!params || (!params['client'] && !params['produit'])) {
            return requests;
        }

        let key: string = params['client'] ? 'clientId' : 'produitId';
        let id: string = params['client'] || params['produit'];
        return requests.filter((request: CreditRequest) => {
            return request[key] == id;
        });
    }
}
@Pipe({ name: 'statusorder' })
export class SatutsOrderPipe implements PipeTransform {
    transform(requests: any[], id?: any) {
        if (!requests) return [];
        if (!id) return requests;
        const order = [null, undefined, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let requestStatusId = id || 'requestStatusId';
        return requests.sort(function (a, b) {
            return order.indexOf(a[requestStatusId]) >
                order.indexOf(b[requestStatusId])
                ? 1
                : -1;
        });
    }
}
@Pipe({ name: 'period' })
export class PeriodPipe implements PipeTransform {
    transform(periodicities: any[], currentProduit: Produit): any {
        if (!currentProduit) return [];
        return currentProduit.periodicities;
    }
}

@Pipe({ name: 'demandeStatusName' })
export class DemandeStatusNamePipe implements PipeTransform {
    transform(statusName: string) {
        switch (statusName) {
            case 'DEMANDE':
                return 'Les demandes non étudiées';
            case 'ETUDE_PREALABLE':
                return 'Les demandes étudiées préalablement';
            case 'ETUDE_DETAILLEE':
                return 'Les demandes déjà étudiées';
            case 'REVOLVING':
                return 'Liste revolving';
            default:
                return statusName;
        }
    }
}
