import { PipeTransform, Pipe } from '@angular/core';
import { LOCAL_FLAG } from '../../shared';
import { RequestPartner } from './request-patner.model';

@Pipe({ name: 'categorie' })
export class CategoriePipe implements PipeTransform {
    transform(produits: RequestPartner[]) {
        return produits.filter((v, i, a) => a.indexOf(v) === i);
    }
}

@Pipe({ name: 'bycategorie' })
export class ByCategoriePipe implements PipeTransform {
    transform(produits: any[], type: any) {
        if (LOCAL_FLAG) return produits;
        if (!type) return produits;
        if (!produits) return [];
        return produits.filter(product => {
            if (product.categorieProduit)
                return product.categorieProduit.id == type;
            else return true;
        });
    }
}
