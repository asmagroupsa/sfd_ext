import { BaseEntity } from '../../shared';

export class CategorieCondition implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public conditions?: BaseEntity[],
    ) {
    }
}
