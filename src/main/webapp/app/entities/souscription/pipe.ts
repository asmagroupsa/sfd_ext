import { PipeTransform, Pipe } from '@angular/core';
import { Souscription } from './souscription.model';
@Pipe({
  name: 'searchdelete'
})
export class NecessaryPipe implements PipeTransform {
  transform(souscriptions: Souscription[], id: number) {
    return souscriptions.filter(souscription => {
      return souscription.code.indexOf('_search') == -1;
    });
  }
}
@Pipe({
  name: 'alreadysouscription'
})
export class AlreadysouscriptionPipe implements PipeTransform {
  transform(souscriptions: Souscription[], profileSouscriptions: any[]) {
    if (!profileSouscriptions) return souscriptions;
    return souscriptions.filter(souscription => {
      return profileSouscriptions.indexOf(souscription.code) == -1;
    });
  }
}

