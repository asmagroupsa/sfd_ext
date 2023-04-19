import { PipeTransform, Pipe } from '@angular/core';
import { Ressource } from './ressource.model';
@Pipe({
  name: 'searchdelete'
})
export class NecessaryPipe implements PipeTransform {
  transform(ressources: Ressource[], id: number) {
    return ressources.filter(ressource => {
      return ressource.code.indexOf('_search') == -1;
    });
  }
}
@Pipe({
  name: 'alreadyressource'
})
export class AlreadyressourcePipe implements PipeTransform {
  transform(ressources: Ressource[], profileRessources: any[]) {
    if (!profileRessources) return ressources;
    return ressources.filter(ressource => {
      return profileRessources.indexOf(ressource.code) == -1;
    });
  }
}

