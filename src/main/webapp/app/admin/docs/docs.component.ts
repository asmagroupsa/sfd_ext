import { Component } from '@angular/core';
import { Parseur } from '../../shared/model/parseur';

@Component({
  selector: 'jhi-docs',
  templateUrl: './docs.component.html'
})
export class JhiDocsComponent {
  isDev: boolean = true;
  constructor(private parseur: Parseur) {}
  parse() {
    this.parseur.addRessources();
  }
}
