import { PipeTransform, Pipe } from '@angular/core';
import { Produit } from '../produit/produit.model';
import { ElementCondition } from '../element-condition/element-condition.model';

@Pipe({ name: 'active' })
export class ConditionPipe implements PipeTransform {
    transform(produits: Produit[]) {
        if (!produits) return [];
        return produits.filter(produit => {
            if (!produit.conditionAccesses) return false;
            return (
                produit.activerConditionAcces &&
                produit.conditionAccesses.length
            );
        });
    }
}

@Pipe({ name: 'element' })
export class ElementPipe implements PipeTransform {
    transform(elements: ElementCondition[], nbre: number = 0) {
        if (!elements || !elements.length) return this.tabs(nbre);
        return elements;
    }
    tabs(nbre: number) {
        let tableau: any[] = Array.from(
            new Array(+nbre + 1),
            (val, index) => index
        );
        tableau = tableau.map(element => {
            return {
                name: element,
                valeur: element,
                flag: true
            };
        });
        return tableau;
    }
}
