import { delegatedMember } from '../entity.module';
import { PipeTransform, Pipe } from '@angular/core';
import { Disponibilite } from './disponibilite.model';
@Pipe({ name: 'comity' })
export class ComityPipe implements PipeTransform {
  transform(disponibilites: Disponibilite[], fragment: any) {
    if (!fragment) return [];
    return disponibilites.filter(disponibilite => {
      return disponibilite.creditComityId == fragment;
    });
  }
}
@Pipe({ name: 'presence' })
export class PresencePipe implements PipeTransform {
  transform(delegatedMembers: any[], disponibles: any[]) {
    if (!disponibles || !disponibles.length || !delegatedMembers)
      return delegatedMembers;
    return delegatedMembers.filter(delegatedMember => {
      return disponibles.indexOf(delegatedMember.user) == -1;
    });
  }
}
