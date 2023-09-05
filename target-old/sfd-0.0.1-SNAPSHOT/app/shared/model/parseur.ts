import { Injectable, NgZone } from '@angular/core';
declare let jQuery: any;
declare let window: any;
import { HOST, createRequestOption, HOST_MVN } from './request-util';
import { Http, Response } from '@angular/http';
import { EventBus } from '..';
@Injectable()
export class Parseur {
  resourceUrl: string = HOST_MVN + '/api/ressources';
  constructor(private http: Http, private ngZone: NgZone) { }
  parse(): any[] {
    let codes = [];
    let url: string = '';
    let attr: string = '';
    let method: string = '';
    let match: any;
    let container = jQuery('.border-0')
      .contents()
      .find('body');
    let heading = container.find(
      '#swagger-ui-container > #resources_container > #resources > li.resource .endpoints > .endpoint .operations li .heading'
    );
    let that = this;
    heading.each(function (index, value) {
      url = jQuery(this)
        .find('h3 .path > .toggleOperation')
        .text();
      attr = jQuery(this)
        .find('h3 .path > .toggleOperation')
        .attr('href');
      url = url.replace(/\/\{[a-zA-Z_-]+\}/g, '');
      method = jQuery(this)
        .find('ul.options > li a.toggleOperation span.markdown p')
        .text();
      codes.push({
        code: 'carmesfnmservice' + url + '/' + method,
        name: that.formatName(method, attr),
        'typeUser': 'SFD'
      });
    });
    return codes;
  }
  private formatName(name, attr) {
    if (name.startsWith('search')) {
      name = 'carmesfnmserviceApp.' + this.getEntity(attr, 'search') + '.home.search';
    } else if (name.startsWith('getAll')) {
      name = 'Récupérer tous les ' + this.getEntity(attr, 'getAll');
    } else if (name.startsWith('create')) {
      name = "Droit de création de l'entité " + this.getEntity(attr, 'create');
    } else if (name.startsWith('update')) {
      name =
        "Droit de modification de l'entité " + this.getEntity(attr, 'update');
    } else if (name.startsWith('delete')) {
      name =
        "Droit de supprission de l'entité: " + this.getEntity(attr, 'delete');
    } else if (name.startsWith('get')) {
      name = "Voir les détails de l'entité: " + this.getEntity(attr, 'get');
    }
    return name;
  }
  private camelCase(name) {
    let SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    let MOZ_HACK_REGEXP = /^moz([A-Z])/;
    return name
      .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      })
      .replace(MOZ_HACK_REGEXP, 'Moz$1');
  }
  private getEntity(name, start) {
    /* let entity = name.replace(start, '');
    if (entity.endsWith('ies')) {
      let index = entity.lastIndexOf('ies');
      entity = entity.substring(0, index) + 'y';
    }
    if (entity.endsWith('s')) {
      entity = entity.slice(0, -1);
    }
    let retour = '';
    if (entity) {
      retour = entity[0].toLowerCase() + entity.slice(1);
    } */
    let retour = name
      .substring(3, name.indexOf('45resource/'))
      .replace(/45/g, '-');

    return this.camelCase(retour);
  }
  addRessources() {
    let allRessources = [
      {
        code: 'RESSOURCE_SFD',
        name: 'Peut voir toutes les données du SFD'
      },
      {
        code: 'RESSOURCE_ZONE_AGENCE',
        name: 'Peut voir toutes les données de la zone du SFD'
      },
      {
        code: 'RESSOURCE_AGENCE',
        name: "Peut voir toutes les données de l'agence du SFD"
      }
    ].concat(this.parse());

    const options = createRequestOption();
    this.ngZone.runOutsideAngular(() => {
      allRessources.forEach(ressource => {
        setTimeout(() => {
          return this.http
            .post(this.resourceUrl, ressource, options).catch((res: Response) => { if (res.status == 401) EventBus.publish('NOT_AUTHORIZED', true); return null; })
            .subscribe((res: Response) => {

            });
        }, 1000);
      });
    });
  }
}

/* 
 scrollPageMethod() {
        if(this.router.url.indexOf('/sfd') == -1) return ;
        let scrollStep = 50;
        let timeToScroll = Math.floor(window.innerHeight / scrollStep) - 1;
        let scroll = (index) => {
        if(this.router.url.indexOf('/sfd') == -1){
         clearTimeout(this.scrollTimeoutId);
         window.scrollTo(0, 0);
             return ;
        }
            window.scrollTo(0, index * scrollStep);
            if (index >= timeToScroll) {
                window.scrollTo(0, 0);
                clearTimeout(this.scrollTimeoutId);
                this.scrollPageMethod();
            }
        };
        for (let index = 1; index <= timeToScroll; index++) {
            this.scrollTimeoutId = setTimeout(() => {
                scroll(index);
            }, 3000 * index);
        }
    }
 */