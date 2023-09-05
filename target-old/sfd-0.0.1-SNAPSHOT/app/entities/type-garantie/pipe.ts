import { TypeGarantie } from './type-garantie.model';
import { Pipe, PipeTransform } from '@angular/core';
import { ConditionGarantie } from '../condition-garantie/condition-garantie.model';

@Pipe({ name: 'filtreconditions' })
export class FiltreConditionsPipe implements PipeTransform {
  transform(value: ConditionGarantie[], conditionGaranties: TypeGarantie) {
    return value;
  }
}
