import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'accepter' })
export class AccepterPipe implements PipeTransform {
    transform(listes: any[]) {
        if (!listes) return [];
        return listes.filter(item => {
            return item.resultat == 'ACCEPTER';
        });
    }
}
