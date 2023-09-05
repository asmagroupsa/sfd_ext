import { PipeTransform, Pipe } from '@angular/core';
import { Etude } from './etude.model';

@Pipe({
  name: 'typetude'
})
export class TypeEtudePipe implements PipeTransform {
  transform(etudes: Etude[], prealable: number) {
    return etudes.filter((etude: Etude) => {
      return etude.etudeTypeId == prealable;
    });
  }
}
