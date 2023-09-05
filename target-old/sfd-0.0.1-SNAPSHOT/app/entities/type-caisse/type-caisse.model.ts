import { BaseEntity } from '../../shared';

export class TypeCaisse implements BaseEntity {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public caisses?: BaseEntity[],
    ) {
    }
}
