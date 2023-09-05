import { LigneCredit } from './ligne-credit.model';
import { PipeTransform, Pipe } from '@angular/core';
@Pipe({ name: 'partner' })
export class PartnerPipe implements PipeTransform {
  transform(lines: LigneCredit[], id: any) {
    if (!id) return lines;
    return lines.filter(line => {
      return line.partnerId == id;
    });
  }
}

@Pipe({ name: 'echeanceline' })
export class EcheancePipe implements PipeTransform {
  transform(echeances, id: any) {
    return echeances.filter(echeance => {
      return echeance.ligneCreditId == id;
    });
  }
}

@Pipe({ name: 'byLigne' })
export class ByLignePipe implements PipeTransform {
  transform(complements, id: any) {
    if(!id || !complements) return complements || [];
    return complements.filter(complement => {
      return complement.ligneCreditId === id;
    });
  }
}
