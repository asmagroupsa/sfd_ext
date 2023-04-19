
import { BaseEntity } from '../../shared';

export class ConditionAcces implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public noteMax?: string,
        public description?: string,
        public produits?: BaseEntity[],
        public categorieId?: number,
        public elements?: BaseEntity[],
    ) {
    }
}
