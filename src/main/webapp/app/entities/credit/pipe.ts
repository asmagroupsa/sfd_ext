import { PipeTransform, Pipe } from '@angular/core';
import { Credit } from './credit.model';
import { LigneCredit } from "../ligne-credit";
@Pipe({ name: 'deblocage' })
export class DeblocagePipe implements PipeTransform {
  transform(credits: Credit[], decaisse: boolean) {
    return credits.filter(credit => {
      return credit.decaisser == decaisse;
    });
  }
}

@Pipe({ name: 'montant' })
export class MontantPipe implements PipeTransform {
  transform(ligneCredits: LigneCredit[], montant: number) {
    if(!montant) return [];
    return ligneCredits.filter((ligneCredit:LigneCredit) => {
      return ligneCredit.amount >= montant;
    });
  }
}
