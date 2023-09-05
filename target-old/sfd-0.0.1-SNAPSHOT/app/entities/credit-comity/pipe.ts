import { PipeTransform, Pipe } from '@angular/core';
import { CreditComity } from './credit-comity.model';
@Pipe({ name: 'closed' })
export class ClosedPipe implements PipeTransform {
  transform(comities: CreditComity[]) {
    return comities.filter((comitie: CreditComity) => {
      return !comitie.closed;
    });
  }
}
