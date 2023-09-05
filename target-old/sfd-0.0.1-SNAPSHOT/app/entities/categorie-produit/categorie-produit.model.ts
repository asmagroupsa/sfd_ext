import { BaseEntity } from '../../shared';

export class CategorieProduit implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public code?: string,
        public produits?: BaseEntity[],
    ) {
    }
}
